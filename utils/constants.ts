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
    Property['Type-of-layout'],
    Property['STA-Notation'],
    Item['collapsible-collapsed-(type-of-layout)'],
  ],
  // properties/statements who never get a headline
  headlines: [
    Property.Annotation,
    Property.description,
    Property['description-(at-the-end)'],
    Property.definition,
    Property['Introduction-text'],
    Property['embedded-(item)'],
    Property['see-(Item)'],
    Property['see-(property)'],
    Property['Type-of-layout-(embedded-element)'],
    Property['Type-of-layout'],
    Property['example(s)'],
    Property.URL,
    Property['WEMI-level'],
    Property.Repetition,
    Property.Status,
  ],
  // qualifier who never render
  qualifier: [
    Property['language-of-the-statement'],
    Property['Type-of-layout'],
    Property['embedded-in-(item)'],
    Property['embedded-in-(property)'],
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
