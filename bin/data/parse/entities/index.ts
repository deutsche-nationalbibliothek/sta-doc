import { readRawData } from '../../read';
import { Property } from '../../../../types/property';
import { DataState, writeJSONFileAndType } from '../../utils';
import { EntityRaw } from '../../types/raw/entity';
import { Notation } from '@/types-parsed/notation';
import { LabelDe } from '@/types-parsed/label-de';
import { LabelEn } from '@/types-parsed/label-en';
import { Entity } from '@/types-parsed/entity';
import { Item } from '../../../../types/item';
import { Coding } from '@/types-parsed/coding';
import { NAMES } from '../../utils/names';
import { groupsDefinition } from './groups-definition';

export const parseEntities = (
  lookup_en: LabelEn,
  lookup_de: LabelDe,
  codings: Coding,
  notations: Notation
) => {
  console.log('\tParsing Entities');
  const rawEntities = readRawData();

  const parseRawEntity = (
    entityId: keyof EntityRaw,
    prevParsedEntity = [],
    embedded = false
  ) => {
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
        console.warn('no entity.claims for', entityId);
        // return {};
      }
      const elementOf: Item =
        entity.claims[Property.elementof] &&
        entity.claims[Property.elementof][0].mainsnak.datavalue.value.id;

      const statementProps = (occurrences) => {
        const filterSort = (domain: string) => {
          const itemGroup = groupsDefinition[elementOf]
            ? groupsDefinition[elementOf]
            : groupsDefinition['default-template'];
          return itemGroup[domain]
            .map((propertyKey) => occurrences[propertyKey])
            .filter((a) => a)
            .sort(
              (occ1, occ2) =>
                itemGroup[domain].indexOf(occ1[0].mainsnak.property) >
                itemGroup[domain].indexOf(occ2[0].mainsnak.property)
            );
        };

        const parseStatementProps = (statement, embeddedStatement = false) => {
          const keyAccess = (occ, ...propertyPath: string[]) => {
            // try {
            return propertyPath.reduce(
              (acc, val) => acc[val],
              embeddedStatement ? occ : occ.mainsnak
            );
            // } catch (e) {
            //   // debugger
            //   console.error(
            //     'Key Access threw an Error on',
            //     propertyPath.join('.'),
            //     'while using',
            //     inQualifier ? 'occ' : 'occ.mainsnak',
            //     'with',
            //     occ
            //   );
            //   console.error(e);
            //   throw e;
            // }
          };

          const parseReferences = (references) => {
            return parseStatementProps(
              references
                .map((ref) =>
                  Object.keys(ref.snaks).map((refKey) => ref.snaks[refKey])
                )
                .flat(),
              true
            );
          };

          const parseWikibaseValue = (occ) => {
            const id = keyAccess(occ, 'datavalue', 'value', 'id');
            return {
              id: id,
              label: lookup_de[id],
              link: `/entities/${id}`,
              coding: codings[id],
            };
          };

          const parseTimeValue = (occ) => {
            return {
              value: keyAccess(occ, 'datavalue', 'value', 'time'),
            };
          };

          const parseStringValue = (occ) => {
            const value = keyAccess(occ, 'datavalue', 'value');
            const id = keyAccess(occ, 'property');
            return {
              value,
              coding: codings[id],
              itemType:
                !embeddedStatement &&
                occ['qualifiers-order'] &&
                occ.qualifiers[occ['qualifiers-order'][0]][0].datavalue?.value
                  .id,
            };
          };

          const parseUrlValue = (occ) => {
            return {
              value: keyAccess(occ, 'datavalue', 'value'),
            };
          };

          const parsedStatements = statement.map((occs) => {
            const dataType = keyAccess(occs[0], 'datatype');
            const simplifiedDataType =
              dataType === 'wikibase-item' ||
                dataType === 'wikibase-entityid' ||
                dataType === 'wikibase-property'
                ? 'wikibasePointer'
                : dataType;
            const property = keyAccess(occs[0], 'property');
            return {
              label: lookup_de[property],
              property,
              [simplifiedDataType]: occs.map((occ) => {
                const snakType = keyAccess(occ, 'snaktype');
                if (snakType === 'novalue') {
                  return { noValue: true };
                } else if (snakType === 'somevalue') {
                  return { unknownValue: true };
                }
                const propertyId = keyAccess(occ, 'property');
                const pointerId = keyAccess(occ, 'datavalue', 'value', 'id');

                return {
                  ...(simplifiedDataType === 'wikibasePointer'
                    ? parseWikibaseValue(occ)
                    : simplifiedDataType === 'time'
                      ? parseTimeValue(occ)
                      : simplifiedDataType === 'url'
                        ? parseUrlValue(occ)
                        : parseStringValue(occ)),
                  references: occ.references && parseReferences(occ.references),
                  embedded:
                    (propertyId === Property['example(s)'] ||
                      propertyId === Property['embedded(item)'] ||
                      propertyId === Property['embedded(property)']) &&
                    !prevParsedEntity.some((id) => id === pointerId) &&
                    parseRawEntity(
                      pointerId,
                      [...prevParsedEntity, entityId],
                      true
                    ),
                  qualifiers:
                    occ.qualifiers &&
                    parseStatementProps(
                      Object.keys(occ.qualifiers).map(
                        (qualiKey) => occ.qualifiers[qualiKey]
                      ),
                      true
                    ),
                };
              }),
            };
          });
          return parsedStatements.map(stringMapper);
        };

        const enrichedParsedStatementProps = {
          header: parseStatementProps(filterSort('header')),
          table: parseStatementProps(filterSort('table')),
          text: parseStatementProps(filterSort('text')),
        };
        return enrichedParsedStatementProps;
      };

      return {
        id: entityId,
        label: !embedded && entity.labels.de?.value, //todo, strip
        title:
          !embedded &&
          elementOf &&
          `${entity.labels.de?.value} | ${lookup_de[elementOf]}`,
        pageType: !embedded && elementOf && lookup_en[elementOf],
        // description:
        //   'de' in entity.descriptions
        //     ? entity.descriptions.de.value
        //     : undefined,
        notation: notations[entityId]?.notation,
        statements: statementProps(entity.claims),
        logo:
          !embedded &&
          entity.claims[Property.logo] &&
          entity.claims[Property.logo][0] &&
          entity.claims[Property.logo][0]?.mainsnak?.datavalue?.value,
      };
    };

    const parsedEntity = {
      ...entityProps(),
    };

    // console.log({ parsedEntity });

    return parsedEntity;
  };

  const entitiesParsed = Object.entries(rawEntities).reduce(
    (acc, [entityId]) => {
      // console.log('parseRawEntity Toplevel entry', entityId);
      acc[entityId] = parseRawEntity(entityId as keyof Entity);
      return acc;
    },
    {} as Entity
  );

  writeJSONFileAndType(entitiesParsed, NAMES.entity, DataState.parsed);
  return entitiesParsed;
};

const stringMapper = (val) => {
  const stringTransform = () => {
    const groupedContent = val.string.reduce((acc, value) => {
      const { itemType, ...otherValues } = value;
      if (
        acc.length > 0 &&
        acc[acc.length - 1].itemType === (itemType || 'default')
      ) {
        const prevAcc = [...acc];
        const lastEntry = prevAcc.pop();
        return [
          ...prevAcc,
          { ...lastEntry, values: [...lastEntry.values, otherValues] },
        ];
      } else {
        return [
          ...acc,
          { itemType: itemType || 'default', values: [otherValues] },
        ];
      }
    }, []);

    const headings = [
      Item.firstordersubheading,
      Item.secondordersubheading,
      Item.thirdordersubheading,
    ];
    const relativeHeadlineEnhancement = groupedContent.reduce((acc, value) => {
      const currenHeadingIndex = headings.indexOf(value.itemType);
      acc = [
        ...acc,
        {
          relativeHeadline:
            currenHeadingIndex >= 0 ? currenHeadingIndex + 1 : undefined,
          ...value,
        },
      ];
      return acc;
    }, []);

    // console.log({relativeHeadlineEnhancement})
    return relativeHeadlineEnhancement;
  };
  return val.string ? { ...val, string: stringTransform() } : val;
};
