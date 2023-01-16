import { EntityId } from '@/types/entity-id';
import { Namespace } from '@/types/namespace';
import { Item } from '../types/item';
import { Property } from '../types/property';

export const blacklist: {
  property: (Item | Property)[];
  headlines: (Item | Property)[];
} = {
  property: [
    Property.Schema,
    Property['Element-of'],
    Property['STA-Notation'],
    Item['collapsible-collapsed-(type-of-layout)'],
  ],
  headlines: [
    Property.Annotation,
    Property.description,
    Property['description-(at-the-end)'],
    Property.definition,
    Property['embedded-(item)'],
    Property['embedded-in-(item)'],
    Property['embedded-in-(property)'],
    Property['see-(Item)'],
    Property['see-(property)'],
    Property['Type-of-layout-(embedded-element)'],
    Property['Type-of-layout'],
    Property['example(s)'],
    Property.URL,
  ],
};

export const isPropertyBlacklisted = (
  property: EntityId,
  list: '' | keyof typeof blacklist = ''
) => {
  if (list) {
    return blacklist[list].includes(property);
  } else {
    return [...blacklist.property, ...blacklist.headlines].includes(property);
  }
};

export const namepsaceClassification: Record<Namespace, Item[]> = {
  RDA: [
    Item['RDA-Guidance'],
    Item['RDA-default-value'],
    Item['RDA-property'],
    Item['RDA-Example'],
    Item['RDA-documentation'],
    Item['RDA-Ressource-Type'],
  ],
  GND: [
    Item['GND-cataloging-level'],
    Item['GND-classification'],
    Item['GND-content-type'],
    Item['GND-data-model'],
    Item['GND-default-value'],
    Item['GND-determination'],
    Item['gndentitytype:entityencoding'],
    Item['gndentitytype:recordtype'],
    Item['GND-gender-685'],
    Item['GND-gender-686'],
    Item['GND-gender-687'],
    Item['GND-gender-688'],
    Item['GND-ontology'],
    Item['GND-relation-type'],
    Item['GND-restriction-of-use'],
    Item['GND-set-of-rules'],
    Item['GND-subfield'],
    Item['GND-type-of-property'],
    Item['GND-usage-indicator'],
    Item['context-of-use'],
    Item['GND-data-field'],
    Item['GND-data-model'],
    Item['GND-default-value'],
    Item['GND-determination'],
  ],
  STA: [
    Item['STA-documentation:-rules'],
    Item['STA-documentation:-example'],
    Item['STA-documentation:-class'],
    Item['STA-documentation:-Example-RDA'],
    Item.Q9071,
  ],
};
