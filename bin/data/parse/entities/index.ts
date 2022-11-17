import { Coding } from '@/types-parsed/coding';
import { Entity } from '@/types-parsed/entity';
import { LabelDe } from '@/types-parsed/label-de';
import { LabelEn } from '@/types-parsed/label-en';
import { Notation } from '@/types-parsed/notation';
import { Headline } from '@/types/headline';
import slugify from 'slugify';
import { Item } from '../../../../types/item';
import { Property } from '../../../../types/property';
import { isPropertyBlacklisted } from '../../../../utils/constants';
import { readRawData } from '../../read';
import { EntityRaw } from '../../types/raw/entity';
import { DataState, writeJSONFileAndType } from '../../utils';
import { NAMES } from '../../utils/names';
import { groupsDefinition } from './groups-definition';

const headings = [
  Item.firstordersubheading,
  Item.secondordersubheading,
  Item.thirdordersubheading,
];

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
    headlines: Headline[],
    currentHeadlineLevel: number,
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

    const addHeadline = (title: string, level: number) => {
      const isHeadlineAlreadyInCollection = (key: string) =>
        headlines.some((headline) => headline.key === key);

      const findAvailableKey = (key: string, index: number): string => {
        const nextHeadline = `${key}-${index}`;
        if (isHeadlineAlreadyInCollection(nextHeadline)) {
          return findAvailableKey(key, index + 1);
        } else {
          return nextHeadline;
        }
      };

      const sluggedLabel = slugify(title);
      const headline = {
        title,
        key: isHeadlineAlreadyInCollection(sluggedLabel)
          ? findAvailableKey(sluggedLabel, 1)
          : sluggedLabel,
        level,
      };
      headlines.push(headline);
      return headline;
    };

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

        const parseStatementProps = (
          statement,
          currentHeadlineLevel,
          { embeddedStatement = false, isTopLevel = false, isTextGroup = false }
        ) => {
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
              currentHeadlineLevel + 1,
              { embeddedStatement: true, isTextGroup }
            );
          };

          const parseWikibaseValue = (occ) => {
            const id = keyAccess(occ, 'datavalue', 'value', 'id');
            const property = keyAccess(occ, 'property');
            const value = lookup_de[property];
            const hasHeadline =
              isTopLevel &&
              isTextGroup &&
              !isPropertyBlacklisted(property) &&
              occ.qualifiers;
            // if (hasHeadline) {
            //   console.log(
            //     'headline parseWikibaseValue',
            //     lookup_de[id],
            //     currentHeadlineLevel + (isTopLevel ? 1 : 0)
            //   );
            // }
            return {
              id: id,
              headline: hasHeadline
                ? addHeadline(
                  lookup_de[id],
                  currentHeadlineLevel + (isTopLevel ? 1 : 0)
                )
                : undefined,
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
            const itemType =
              !embeddedStatement &&
              occ['qualifiers-order'] &&
              occ.qualifiers[occ['qualifiers-order'][0]][0].datavalue?.value.id;
            const headingIndex = headings.findIndex(
              (heading) => heading === itemType
            );
            // if (headingIndex >= 0) {
            //   console.log(
            //     'headline stringValue',
            //     value,
            //     currentHeadlineLevel + headingIndex + (isTopLevel ? 1 : 0)
            //   );
            // }
            return {
              value,
              headline:
                headingIndex >= 0 && isTextGroup
                  ? addHeadline(
                    value,
                    currentHeadlineLevel + headingIndex + (isTopLevel ? 1 : 0)
                  )
                  : undefined,
              coding: codings[id],
              itemType,
            };
          };

          const parseUrlValue = (occ) => {
            return {
              value: keyAccess(occ, 'datavalue', 'value'),
            };
          };

          const parsedStatements = statement.map((occs, index) => {
            const dataType = keyAccess(occs[0], 'datatype');
            const simplifiedDataType =
              dataType === 'wikibase-item' ||
                dataType === 'wikibase-entityid' ||
                dataType === 'wikibase-property'
                ? 'wikibasePointer'
                : dataType;
            const property = keyAccess(occs[0], 'property');
            const label = lookup_de[property];
            const hasHeadline =
              isTopLevel && isTextGroup && !isPropertyBlacklisted(property);
            // if (hasHeadline) {
            //   console.log('top level headline', label, currentHeadlineLevel);
            // }
            return {
              label,
              headline: hasHeadline
                ? addHeadline(label, currentHeadlineLevel)
                : undefined,
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

                const hasEmbedding =
                  (propertyId === Property['example(s)'] ||
                    propertyId === Property['embedded(item)'] ||
                    propertyId === Property['embedded(property)']) &&
                  !prevParsedEntity.some((id) => id === pointerId);

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
                    hasEmbedding &&
                    parseRawEntity(
                      pointerId,
                      headlines,
                      currentHeadlineLevel + 1,
                      [...prevParsedEntity, entityId],
                      true
                    ).parsedEntity,
                  qualifiers:
                    occ.qualifiers &&
                    parseStatementProps(
                      Object.keys(occ.qualifiers).map(
                        (qualiKey) => occ.qualifiers[qualiKey]
                      ),
                      currentHeadlineLevel + (hasEmbedding ? 1 : 0),
                      { embeddedStatement: true, isTextGroup }
                    ),
                };
              }),
            };
          });
          return parsedStatements.map(stringMapper);
        };

        const enrichedParsedStatementProps = {
          header: parseStatementProps(
            filterSort('header'),
            currentHeadlineLevel + 1,
            {
              isTopLevel: !embedded,
            }
          ),
          table: parseStatementProps(
            filterSort('table'),
            currentHeadlineLevel + 1,
            {
              isTopLevel: !embedded,
            }
          ),
          text: parseStatementProps(
            filterSort('text'),
            currentHeadlineLevel + 1,
            {
              isTextGroup: true,
              isTopLevel: !embedded,
            }
          ),
        };
        return enrichedParsedStatementProps;
      };

      // if (!embedded) {
      //   console.log(
      //     'Top level headline',
      //     entity.labels.de?.value,
      //     currentHeadlineLevel
      //   );
      // }

      return {
        id: entityId,
        headline: !embedded
          ? addHeadline(entity.labels.de?.value, currentHeadlineLevel)
          : undefined,
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

    return { parsedEntity, headlines };
  };

  const entitiesParsed = Object.entries(rawEntities).reduce(
    (acc, [entityId]) => {
      // console.log('parseRawEntity Toplevel entry', entityId);
      const { parsedEntity, headlines } = parseRawEntity(
        entityId as keyof Entity,
        [],
        1
      );
      // console.log(headlines, headlines.length);
      acc[entityId] = { entity: parsedEntity, headlines };
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

    return groupedContent;
  };
  return val.string ? { ...val, string: stringTransform() } : val;
};
