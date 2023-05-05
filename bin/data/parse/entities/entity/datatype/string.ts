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
}: ParseStringValue): Omit<StringValue, keyof CommonValue> => {
  const { codings } = data;
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

  const headings = [
    Item['First-order-subheading-(type-of-layout)'],
    Item['Second-order-subheading-(type-of-layout)'],
    Item['Third-order-subheading-(type-of-layout)'],
    Item['Fourth-order-subheading-(type-of-layout)'],
  ];

  const headingIndex = headings.findIndex((heading) => heading === itemType);
  const hasHeadline = !isMissingValue && headingIndex >= 0;

  return {
    value,
    headline: hasHeadline
      ? addHeadline(
          value,
          currentHeadlineLevel +
            headingIndex +
            (isPropertyBlacklisted(property, 'headlines') ? 0 : 1),
          noHeadline
        )
      : undefined,
    codings: codings[property],
    itemType,
  };
};
