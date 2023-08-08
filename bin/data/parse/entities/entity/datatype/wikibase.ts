import { pick } from 'lodash';
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
import namespaceConfig from '../../../../../../config/namespace';
import { Item } from '../../../../../../types/item';

interface ParseWikibaseValueProps extends Required<ParseStatementsProps> {
  occ: Claim | StatementRaw;
  keyAccessOcc: <T>(...keys: string[]) => T;
  isMissingValue: boolean;
}

export const parseWikibaseValue = (
  props: ParseWikibaseValueProps
): Omit<WikibasePointerValue, keyof CommonValue> | void => {
  const {
    occ,
    currentHeadlineLevel,
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
  const id = isMissingValue
    ? Item['undefined-of-Default-value']
    : keyAccessOcc<EntityId>('datavalue', 'value', 'id');

  const hasHeadline =
    isTopLevel &&
    !isPropertyBlacklisted(id) &&
    'qualifiers' in occ &&
    occ.qualifiers &&
    (isElementsPropOnRdaRessourceType
      ? Object.keys(pick(occ.qualifiers, wemiSpecificsWhitelist)).length > 0
      : true);

  const namespaceId = schemas[id];
  const pointingNamespace: Namespace = namespaceConfig.map[namespaceId];

  if (namespaceConfig.notUsed.includes(pointingNamespace)) {
    return;
  }

  const staNotationLabel = staNotations[id]?.label;

  const parentPropertyId = 'parentProperty' in occ && occ.parentProperty;

  const label =
    isElementsPropOnRdaRessourceType &&
    parentPropertyId === Property['Elements'] &&
    staNotationLabel
      ? `${staNotationLabel.split('-').pop() ?? ''} - ${labelsDe[id]}`
      : labelsDe[id];

  return {
    id,
    headline: hasHeadline
      ? addHeadline(label, currentHeadlineLevel, noHeadline, pointingNamespace)
      : undefined,
    label,
    namespace: pointingNamespace,
    staNotationLabel,
    codings: codings[id],
  };
};
