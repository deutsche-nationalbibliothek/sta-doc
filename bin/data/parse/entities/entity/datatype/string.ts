import { Item } from '../../../../../../types/item';
import {
  StringValue,
  CommonValue,
  ItemType,
} from '../../../../../../types/parsed/entity';
import { Property } from '../../../../../../types/property';
import { Claim, StatementRaw } from '../../../../../../types/raw/entity';
import { ParseStatementsProps } from '../statements';

interface ParseStringValue extends Required<ParseStatementsProps> {
  keyAccessOcc: <T>(...keys: string[]) => T;
  occ: Claim | StatementRaw;
}

export const parseStringValue = ({
  keyAccessOcc,
  embedded,
  occ,
  addHeadline,
  data,
  noHeadline,
  currentHeadlineLevel,
}: ParseStringValue): Omit<StringValue, keyof CommonValue> => {
  const { codings } = data;
  const snakType = keyAccessOcc('snaktype');
  const value =
    snakType === 'novalue'
      ? 'Kein Wert'
      : snakType === 'somevalue'
      ? 'unbekannter Wert'
      : keyAccessOcc<string>('datavalue', 'value');
  const property = keyAccessOcc<Property>('property');

  const itemType: ItemType =
    snakType === 'novalue' || snakType === 'somevalue'
      ? snakType
      : (!embedded &&
          'qualifiers-order' in occ &&
          occ.qualifiers &&
          occ['qualifiers-order'] &&
          occ.qualifiers[occ['qualifiers-order'][0] as Property][0].datavalue
            ?.value?.id) ||
        'default';

  const headings = [
    Item['First-order-subheading-(type-of-layout)'],
    Item['Second-order-subheading-(type-of-layout)'],
    Item['Third-order-subheading-(type-of-layout)'],
  ];

  const headingIndex = headings.findIndex((heading) => heading === itemType);
  const hasHeadline = headingIndex >= 0 && itemType;
  // !isPropertyBlacklisted(itemType ?? property, 'headlines');

  return {
    value,
    headline: hasHeadline
      ? addHeadline(value, currentHeadlineLevel + headingIndex, noHeadline)
      : undefined,
    codings: codings[property],
    itemType,
  };
};
