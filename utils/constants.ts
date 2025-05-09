import { EntityId } from '@/types/entity-id';
import { Item } from '../types/item';
import { Property } from '../types/property';

export const blacklist: {
  property: (Item | Property)[];
  headlines: (Item | Property)[];
  qualifier: (Item | Property)[];
} = {
  // properties/statements who never render
  property: [
    Property.Schema,
    Property['Element-of'],
    Property['Context-of-use'],
    Property['embedded-in-(item)'],
    Property['embedded-in-(property)'],
    Property['STA-Notation'],
    Item['collapsible-collapsed-(type-of-layout)'],
    Property['Type-of-layout'],
    Property['Version-number-of-STA-documentation'],
    Property['Release-number-of-STA-documentation'],
  ],
  // properties/statements who never get a headline
  headlines: [
    Property.Annotation,
    Property.description,
    Property['description-(at-the-end)'],
    Property.definition,
    Property['embedded-(item)'],
    Property['entity-type-domain'],
    Property.Encoding,
    Property['example(s)'],
    Property['Link-(Item)'],
    Property['Link-(Property)'],
    Property['Introduction-text'],
    Property['Implementation-in-the-GND'],
    Property['permitted-characteristics'],
    Property['permited-values'],
    Property['Recording-method'],
    Property['Relationships-to-other-elements-of-Doc:-RDA-property'],
    Property.Repetition,
    Property['RDA-Reference'],
    Property['see-(Item)'],
    Property['see-(property)'],
    Property.Status,
    Property['Type-of-layout-(embedded-element)'],
    Property['Type-of-layout'],
    Property.URL,
    Property['WEMI-level'],
  ],
  // qualifier who never render
  qualifier: [
    Property['embedded-in-(item)'],
    Property['embedded-in-(property)'],
    Property['Language-of-the-statement'],
    Property['Link-(Item)'],
    Property['Link-(Property)'],
    Property['original-language'],
    Property['Language-of-the-statement'],
  ],
};

export const isPropertyBlacklisted = (
  property: EntityId,
  list: '' | keyof typeof blacklist = ''
) => {
  if (list) {
    return blacklist[list].includes(property);
  } else {
    return [
      ...blacklist.property,
      ...blacklist.headlines,
      ...blacklist.qualifier,
    ].includes(property);
  }
};
