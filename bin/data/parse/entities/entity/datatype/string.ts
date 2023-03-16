import { EntityId } from '../../../../../../types/entity-id';
import { Item } from '../../../../../../types/item';
import {
  StringValue,
  CommonValue,
} from '../../../../../../types/parsed/entity';
import { Property } from '../../../../../../types/property';
import { Claim, StatementRaw } from '../../../../../../types/raw/entity';
import { isPropertyBlacklisted } from '../../../../../../utils/constants';
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
  const value = keyAccessOcc<string>('datavalue', 'value');
  const property = keyAccessOcc<Property>('property');
  const itemType: EntityId =
    (!embedded &&
      'qualifiers-order' in occ &&
      occ.qualifiers &&
      occ['qualifiers-order'] &&
      occ.qualifiers[occ['qualifiers-order'][0] as Property][0].datavalue?.value
        ?.id);

  const headings = [
    Item['First-order-subheading-(type-of-layout)'],
    Item['Second-order-subheading-(type-of-layout)'],
    Item['Third-order-subheading-(type-of-layout)'],
  ];

  const headingIndex = headings.findIndex((heading) => heading === itemType);
  const hasHeadline =
    headingIndex >= 0 && itemType
    !isPropertyBlacklisted(itemType ?? property, 'headlines');

  return {
    value,
    headline: hasHeadline
      ? addHeadline(value, currentHeadlineLevel + headingIndex, noHeadline)
      : undefined,
    coding: codings[property],
    itemType,
  };
};
