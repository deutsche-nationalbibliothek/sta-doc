import { pick } from 'lodash';
import namespaceConfig, {
  NamespaceId,
} from '../../../../../../config/namespace';
import { EntityId } from '../../../../../../types/entity-id';
import { Namespace } from '../../../../../../types/namespace';
import {
  WikibasePointerValue,
  CommonValue,
} from '../../../../../../types/parsed/entity';
import { Property } from '../../../../../../types/property';
import { Claim, StatementRaw } from '../../../../../../types/raw/entity';
import { isPropertyBlacklisted } from '../../../../../../utils/constants';
import { ParseStatementsProps } from '../statements';

interface ParseWikibaseValueProps extends Required<ParseStatementsProps> {
  occ: Claim | StatementRaw;
  addStaStatement?: boolean;
  keyAccessOcc: <T>(...keys: string[]) => T;
  isMissingValue: boolean;
}

export const parseWikibaseValue = (
  props: ParseWikibaseValueProps
): Omit<WikibasePointerValue, keyof CommonValue> | void => {
  const {
    occ,
    currentHeadlineLevel,
    addStaStatement = false,
    isElementsPropOnRdaRessourceType,
    keyAccessOcc,
    data,
    isTopLevel,
    isMissingValue,
    addHeadline,
    noHeadline,
  } = props;
  const wemiSpecificsWhitelist = [
    Property.description,
    Property['embedded-(item)'],
    Property['description-(at-the-end)'],
  ];

  const { schemas, labelsDe, staNotations, codings } = data;
  const id = keyAccessOcc<EntityId>('datavalue', 'value', 'id');

  const hasHeadline =
    !isMissingValue &&
    isTopLevel &&
    !isPropertyBlacklisted(id) &&
    'qualifiers' in occ &&
    occ.qualifiers &&
    (isElementsPropOnRdaRessourceType
      ? Object.keys(pick(occ.qualifiers, wemiSpecificsWhitelist)).length > 0
      : true);

  const namespaceId = schemas[id] as NamespaceId;
  const pointingNamespace: Namespace = namespaceConfig.map[namespaceId];

  if (namespaceConfig.notUsed.includes(pointingNamespace)) {
    return;
  }

  return {
    id,
    headline: hasHeadline
      ? addHeadline(
          labelsDe[id],
          currentHeadlineLevel,
          noHeadline,
          pointingNamespace
        )
      : undefined,
    label: labelsDe[id],
    link: `/entities/${id}`,
    namespace: pointingNamespace,
    staNotationLabel:
      addStaStatement && id in staNotations
        ? staNotations[id].label.toUpperCase()
        : undefined,
    codings: codings[id],
  };
};
