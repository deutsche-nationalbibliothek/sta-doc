import { Property } from '../types/property';

export const blacklist = {
  property: [Property.schema, Property.elementof],
  headlines: [
    Property.annotation,
    Property.description,
    Property['embedded(item)'],
    Property['see(item)'],
    Property['see(property)'],
    Property['typeoflayout(embeddedelement)'],
    Property.typeoflayout,
    Property['example(s)'],
    Property.url,
  ],
};

export const isPropertyBlacklisted = (
  property: Property,
  list: '' | keyof typeof blacklist = ''
) => {
  if (list) {
    return blacklist[list].includes(property);
  } else {
    return [...blacklist.property, ...blacklist.headlines].includes(property);
  }
};
