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
  occ: Claim | StatementRaw;
  isMissingValue: boolean;
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
  const langFr = 'qualifiers' in occ && occ.qualifiers && occ.qualifiers[Property['Language-of-the-statement']] ? occ.qualifiers[Property['Language-of-the-statement']][0].datavalue?.value as unknown as string : ''
  if (lang === 'de' && langFr === 'fr' || lang === 'fr' && langFr === 'de') { 
    return 
  }
  const { codings, labelsDe, staNotations } = data;
  const value = !isMissingValue
    ? keyAccessOcc<string>('datavalue', 'value')
    : '';
  const property = keyAccessOcc<Property>('property');
  const itemType: ItemType = isMissingValue
    ? keyAccessOcc('snaktype')
    : ('qualifiers-order' in occ &&
        occ.qualifiers &&
        occ['qualifiers-order'] &&
        occ['qualifiers-order'][0] &&
        occ.qualifiers[occ['qualifiers-order'][0] as Property] &&
        occ.qualifiers[occ['qualifiers-order'][0] as Property][0].datavalue
          ?.value?.id) ||
      'default';
  const isLink: EntityId | undefined = ('qualifiers' in occ && occ.qualifiers && occ.qualifiers[Property['Link-(Item)']] && occ.qualifiers[Property['Link-(Item)']][0].datavalue?.value.id)
    ? occ.qualifiers[Property['Link-(Item)']][0].datavalue?.value.id
    : ('qualifiers' in occ && occ.qualifiers && occ.qualifiers[Property['Link-(Property)']] && occ.qualifiers[Property['Link-(Property)']][0].datavalue?.value.id)
    ? occ.qualifiers[Property['Link-(Property)']][0].datavalue?.value.id
    : undefined
  const linkLabel: string | undefined = isLink ? labelsDe[isLink] : undefined
  const linkStaNotation: string | undefined = isLink && staNotations[isLink] ? staNotations[isLink].label : undefined

  const headings = [
    Item['First-order-subheading-(type-of-layout)'],
    Item['Second-order-subheading-(type-of-layout)'],
    Item['Third-order-subheading-(type-of-layout)'],
    Item['Fourth-order-subheading-(type-of-layout)'],
  ];

  const headingIndex = headings.findIndex((heading) => heading === itemType);
  const hasHeadline = !isMissingValue && headingIndex >= 0;
  const nextHeaderLevel = 
    currentHeadlineLevel + headingIndex

  return {
    value,
    headline: hasHeadline
      ? addHeadline(
          value,
          nextHeaderLevel,
          noHeadline
        )
      : undefined,
    codings: codings[property],
    itemType,
    isLink,
    linkLabel,
    linkStaNotation
  };
};
