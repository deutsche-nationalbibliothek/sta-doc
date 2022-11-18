import { Item } from '@/types/item';
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

export const dataSources = {
  RDA: [
    Item.rdaguidance,
    Item.rdadefaultvalue,
    Item.rdaproperty,
    Item['rda-example'],
    Item['rda-documentation'],
  ],
  GND: [
    Item.gndcataloginglevel,
    Item.gndclassification,
    Item.gndcontenttype,
    Item.gnddatamodel,
    Item.gnddefaultvalue,
    Item.gnddetermination,
    Item['gndentitytype:entityencoding'],
    Item['gndentitytype:recordtype'],
    Item.gndgender1,
    Item.gndgender2,
    Item.gndgender3,
    Item.gndgender4,
    Item.gndontology,
    Item.gndrelationtype,
    Item.gndrestrictionofuse,
    Item.gndsetofrules,
    Item.gndsubfield,
    Item.gndtypeofproperty,
    Item.gndusageindicator,
    Item.gndusercommunity,
  ],
};
