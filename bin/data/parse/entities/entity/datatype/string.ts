import { EntityId } from '../../../../../../types/entity-id';
import { Item } from '../../../../../../types/item';
import {
  StringValue,
  CommonValue,
  ItemType,
} from '../../../../../../types/parsed/entity';
import { Property } from '../../../../../../types/property';
import { Claim, StatementRaw } from '../../../../../../types/raw/entity';
import { isPropertyBlacklisted } from '../../../../../../utils/constants';
import { ParseStatementsProps } from '../statements';

interface ParseStringValue extends Required<ParseStatementsProps> {
  keyAccessOcc: <T>(...keys: string[]) => T;
  occ: Claim;
  isMissingValue: boolean;
}

function getLinkId(occ: any, property: string): EntityId | undefined {
  if ('qualifiers' in occ && occ.qualifiers && occ.qualifiers[property]) {
    return occ.qualifiers[property][0].datavalue?.value.id;
  }
  return undefined;
}

export const parseStringValue = ({
  keyAccessOcc,
  occ,
  addHeadline,
  data,
  noHeadline,
  currentHeadlineLevel,
  isMissingValue,
  lang
}: ParseStringValue): Omit<StringValue, keyof CommonValue> | undefined => {
  const { codings, labelsDe, labelsFr, staNotations } = data;
  const value = !isMissingValue
    ? keyAccessOcc<string>('datavalue', 'value')
    : '';
  const property = keyAccessOcc<Property>('property');
  const withLayoutId = occ.qualifiers?.[Property['Type-of-layout']]?.[0]?.datavalue
    ?.value?.id as unknown as EntityId || undefined;
  const itemType: ItemType = isMissingValue
    ? keyAccessOcc('snaktype')
    : withLayoutId && withLayoutId ||
      'default';
  const isLink: EntityId | undefined =
    getLinkId(occ, Property['Link-(Item)']) ||
    getLinkId(occ, Property['Link-(Property)']) ||
    undefined;
  const linkLabel: string | undefined = isLink && lang === 'de' ? labelsDe[isLink] 
    : isLink && lang === 'fr' ? labelsFr[isLink] : undefined
  const linkStaNotation: string | undefined = isLink && staNotations[isLink] 
    ? staNotations[isLink].label : undefined

  const headings = [
    Item['First-order-subheading-(type-of-layout)'],
    Item['Second-order-subheading-(type-of-layout)'],
    Item['Third-order-subheading-(type-of-layout)'],
    Item['Fourth-order-subheading-(type-of-layout)'],
  ];

  const headingIndex = headings.findIndex((heading) => heading === itemType);
  const hasHeadline = !isMissingValue && headingIndex >= 0;
  const nextHeadlineLevel = 
    currentHeadlineLevel + headingIndex

  return {
    value,
    headline: hasHeadline
      ? addHeadline(
          value,
          nextHeadlineLevel,
          noHeadline
        )
      : undefined,
    codings: codings[property],
    itemType,
    isLink,
    linkLabel,
    linkStaNotation,
  };
};
