import {
  readRawData,
} from '../read';
import { Property } from '../../../types/property';
import { DataState, writeJSONFileAndType } from '../utils';
import { EntityRaw } from '../types/raw/entity';
import { Notation } from '@/types-generated/notation';
import { LabelDe } from '@/types-generated/label-de';
import { LabelEn } from '@/types-generated/label-en';
import { Entity } from '@/types-generated/entity';
import { Item } from '../../../types/item';
import { Codings } from '@/types/entry';

export const parseEntities = (
  lookup_en: LabelEn,
  lookup_de: LabelDe,
  codings: Codings,
  notations: Notation
) => {
  console.log('\tParsing Entities');
  const rawEntities = readRawData();

  const parseRawEntity = (entityId: keyof EntityRaw) => {
    const entity = rawEntities[entityId];
    if (!entity) {
      console.warn(
        'entity not found:',
        entityId,
        '. But referenced in the dataset'
      );
      return {};
    }

    const entityProps = () => {
      if (!(Property.elementof in entity.claims)) {
        console.warn('no entity.claims for', entityId)
      }
      const elementOf: Item = entity.claims[Property.elementof][0].mainsnak.datavalue.value.id

      const statementProps = (occurrences) => {
        const filterSort = (domain: string) => itemGroups[elementOf][domain].map(propertyKey => occurrences[propertyKey]).filter(a => a).sort((occ1, occ2) =>
          itemGroups[elementOf][domain].indexOf(occ1[0].mainsnak.property) > itemGroups[elementOf][domain].indexOf(occ2[0].mainsnak.property)
        )


        const parseStatement = (statement, inQualifier = false) => {
          const keyAccess = (occ, ...propertyPath: string[]) => propertyPath.reduce((acc, val) => acc[val], inQualifier ? occ : occ.mainsnak)

          const parseWikibasePointer = (occ) => {

            const id = keyAccess(occ, 'datavalue', 'value', 'id')
            return {
              id: id,
              label: lookup_de[id],
              link: `/entries/${id}`,
              coding: codings[id],
              embedded: (id === Property['example(s)'] ||
                id === Property['embedded(item)'] ||
                id === Property['embedded(property)']) && id,
              qualifiers: occ.qualifiers && parseStatement(Object.keys(occ.qualifiers).map(qualiKey => occ.qualifiers[qualiKey]), true),
              references: occ.references && parseStatement(occ.references.map(ref => Object.keys(ref.snaks).map(refKey => ref.snaks[refKey])).flat(), true)
            }
          }
          const parseTimeValue = (occ) => {
            return {
              value: keyAccess(occ, 'datavalue', 'value', 'time')
            }
          }
          const parseStringValue = (occ) => {
            if (keyAccess(occ, 'datavalue', 'value') === 'Vergabe von Formangaben mit einem Hierarchieverhältnis') {
            }
            return {
              value: keyAccess(occ, 'datavalue', 'value'),
              itemType: !inQualifier && occ['qualifiers-order'] && occ.qualifiers[occ['qualifiers-order'][0]][0].datavalue.value.id,
            }
          }
          const parseUrlValue = (occ) => {
            return {
              value: keyAccess(occ, 'datavalue', 'value')
            }
          }
          const jj = statement.map(occs => {
            const dataType = keyAccess(occs[0], 'datatype')
            return {
              label: lookup_de[keyAccess(occs[0], 'property')],
              [dataType]: occs.map(occ => {
                return {
                  ...(dataType === 'wikibase-item' || dataType === 'wikibase-property') ? parseWikibasePointer(occ) : dataType === 'time' ? parseTimeValue(occ) : dataType === 'url' ? parseUrlValue(occ) : parseStringValue(occ),
                  occ
                }
              })
            }
          })
          return jj
        }

        const kk = {
          table: parseStatement(filterSort('table')),
          text: parseStatement(filterSort('text')).map((val) => {
            const stringTransform = () => {
              return val.string.reduce((acc, value) => {
                if (acc.length > 0 && acc[acc.length - 1].itemType === (value.itemType || 'default')) {
                  const prevAcc = [...acc]
                  const lastEntry = prevAcc.pop();
                  return [...prevAcc, { ...lastEntry, values: [...lastEntry.values, value] }];
                } else {
                  return [...acc, { itemType: value.itemType || 'default', values: [value] }]
                }
              }, [])
            }
            return val.string ? { ...val, string: stringTransform() } : val
          })
        }
        // console.log(kk)
        // debugger;
        return kk
      }

      return {
        id: entityId,
        label: entity.labels.de?.value, //todo, strip
        title: `${entity.labels.de?.value} ${lookup_de[elementOf]}`,
        pageType: lookup_en[elementOf],
        description:
          'de' in entity.descriptions ? entity.descriptions.de.value : undefined,
        notation: notations[entityId]?.notation,
        statements: statementProps(entity.claims),
        logo: entity.claims[Property.logo] && entity.claims[Property.logo][0] && entity.claims[Property.logo][0]?.mainsnak?.datavalue?.value
      }
    }

    return {
      ...entityProps(),
    };
  };

  const entitiesParsed = Object.entries({ 'P409': rawEntities['P409'] }).reduce(
    (acc, [entityId]) => {
      // console.log('parseRawEntity Toplevel entry', entityId);
      acc[entityId] = parseRawEntity(entityId as keyof Entity);
      return acc;
    },
    {} as Entity
  );

  writeJSONFileAndType(entitiesParsed, {
    file: { singular: 'entity_p409', plural: 'entities_p409' },
    type: 'EntityP58',
  }, DataState.parsed);
  return entitiesParsed;
};

const itemGroups = {
  [Item.gnddatafield]: {
    table: [
      // todo, add later
      Property.repetition,
    ],
    text: [
      Property.description,
      Property.subfields,
      Property.validation,
      Property.implementationprovisions,
      Property.applicablefordatafield,
      Property.permitedvalues,
      Property['example(s)'],
      Property.authorizations,
    ],
  },
  [Item.gndsubfield]: {
    table: [
      // todo, add later
    ] as Property[],
    text: [
      Property.encoding,
      Property.description,
      Property.validation,
      Property.implementationprovisions,
      Property.applicablefordatafield,
      Property.permitedvalues,
      Property['example(s)'],
    ],
  },
  [Item['gndentitytype:entityencoding']]: {
    table: [
      // todo, add later
    ] as Property[],
    text: [
      Property.encoding,
      Property.description,
      Property.datafields,
      Property.subfields,
      Property.validation,
      Property.implementationprovisions,
      Property.applicablefordatafield,
      Property.permitedvalues,
      Property['example(s)'],
      Property.applicablefordatafield,
      Property.applicablefortypeofentity,
    ],
  },
  [Item['stadocumentation:rules']]: {
    table: [
      // todo, add later
    ] as Property[],
    text: [
      // Property["embedded(property)"],
      // Property["embeddedin(item)"],
      // Property["embeddedin(property)"],
      Property.description,
    ],
  },
  [Item.rdaproperty]: {
    table: [
      Property['entitytype/domain'],
      Property.parentproperty,
      Property.standardelementfor,
      Property.subproperties,
    ],
    text: [
      Property.description,
      Property.recordingmethod,
      Property.sourcesofinformation,
      Property.basicrules,
      Property.specialrules,
      Property.specificrules,
      Property.permitedvalues,
      Property['example(s)'],
    ],
  },
  [Item['rda-ressourcetype']]: {
    table: [
      Property.elements,
    ],
    text: [
      Property.description,
      Property.elements,
      Property.sourcesofinformation,
      Property['description(attheend)'],
    ],
  },
  //['default-template']: {
  //  // default renders tableProps, but NOT restProps like above
  //  table: [
  //    // todo, add later
  //  ],
  //  text: [
  //    //empty on purpose
  //  ],
  //  // here no render
  //  // ignoreProperties: [
  //  //   Property.schema,
  //  //   Property.elementof,
  //  //   Property.definition,
  //  //   Property.logo,
  //  // ],
  //},
}
