import slugify from 'slugify';
import { ParseEntitiesProps } from '.';
import { DataSource } from '../../../../types/data-source';
import { EntityId } from '../../../../types/entity-id';
import { Headline } from '../../../../types/headline';
import { Item } from '../../../../types/item';
import {
  EntityEntry,
  Entity,
  StringValue,
  StringValueContainer,
  Statement,
  StatementsByGroup,
  WikiBaseValue,
  CommonValue,
  TimeValue,
  UrlValue,
  PageType,
} from '../../../../types/parsed/entity';
import { Property } from '../../../../types/property';
import { Claim, Reference, StatementRaw } from '../../../../types/raw/entity';
import { isPropertyBlacklisted } from '../../../../utils/constants';
import { groupsDefinition } from './groups-definition';

type DataType = 'string' | 'wikibasePointer' | 'time' | 'url';
type PreMappedStatement = Omit<Statement, 'string'> & {
  string?: StringValue[];
};

const headings = [
  Item['First-order-subheading-(type-of-layout)'],
  Item['Second-order-subheading-(type-of-layout)'],
  Item['Third-order-subheading-(type-of-layout)']
];

interface ParseEntityProps extends Omit<ParseEntitiesProps, 'rawEntities'> {
  entityId: EntityId;
  headlines?: Headline[];
  currentHeadlineLevel?: number;
  prevParsedEntities?: EntityId[];
  embedded?: boolean;
}

export const parseRawEntity = async ({
  entityId,
  data,
  getRawEntityById,
  headlines = [],
  currentHeadlineLevel = 1,
  prevParsedEntities = [],
  embedded = false,
}: ParseEntityProps): Promise<EntityEntry | undefined> => {
  const { lookup_de, lookup_en, codings, notations } = data;
  const entity = await getRawEntityById(entityId);

  if (!entity) {
    console.warn(
      'entity not found:',
      entityId,
      '. But referenced in the dataset'
    );
    return;
  }

  const addHeadline = (
    title: string,
    level: number,
    dataSource?: DataSource
  ) => {
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
    headlines.push(dataSource ? { ...headline, dataSource } : headline);
    return headline;
  };

  const entityProps = async (): Promise<Entity> => {
    const elementOfId: Item =
      entity &&
      entity.claims[Property['Element-of']] &&
      entity.claims[Property['Element-of']][0].mainsnak.datavalue?.value.id;

    if (!elementOfId) {
      console.warn('no entity.claims with Property.elementof for', entityId);
      // return {};
    }

    const statementProps = async (
      occurrences: Record<EntityId, Claim[]>
    ): Promise<StatementsByGroup> => {
      const filterSort = (group: 'header' | 'table' | 'text') => {
        const itemGroup =
          elementOfId in groupsDefinition
            ? groupsDefinition[elementOfId as keyof typeof groupsDefinition]
            : groupsDefinition['default-template'];
        return (
          (
            itemGroup[group]
              .map((propertyKey) => occurrences[propertyKey])
              // .map((propertyKey) => occurrences[propertyKey])
              .filter((a) => a) as unknown as Claim[][]
          ).sort((occ1, occ2) =>
            itemGroup[group].indexOf(occ1[0].mainsnak.property) >
            itemGroup[group].indexOf(occ2[0].mainsnak.property)
              ? 1
              : -1
          )
        );
      };

      const parseStatementProps = async (
        statements: StatementRaw[][] | Claim[][],
        currentHeadlineLevel: number,
        { embeddedStatement = false, isTopLevel = false, isTextGroup = false }
      ): Promise<Statement[]> => {
        const keyAccess = <T>(
          occ: any, //Claim | StatementRaw,
          ...propertyPath: string[]
        ): T => {
          // try {
          return propertyPath.reduce(
            (acc, val) => acc[val as keyof typeof acc],
            'mainsnak' in occ ? occ.mainsnak : occ
          ) as T;
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

        const parseReferences = async (references: Reference[]) => {
          const o = references
            .map((ref) =>
              Object.keys(ref.snaks).map(
                (refKey) => ref.snaks[refKey as keyof typeof ref.snaks]
              )
            )
            .flat() as StatementRaw[][];
          return await parseStatementProps(
            o,
            currentHeadlineLevel, // + 1,
            { embeddedStatement: true, isTextGroup }
          );
        };

        const parseWikibaseValue = (
          occ: Claim | StatementRaw,
          currentHeadlineLevel: number
        ): Omit<WikiBaseValue, keyof CommonValue> => {
          const id = keyAccess<EntityId>(occ, 'datavalue', 'value', 'id');
          const property = keyAccess<Property>(occ, 'property');
          const hasHeadline =
            isTopLevel &&
            isTextGroup &&
            !isPropertyBlacklisted(property) &&
            'qualifiers' in occ &&
            occ.qualifiers;
          return {
            id,
            headline: hasHeadline
              ? addHeadline(lookup_de[id], currentHeadlineLevel)
              : undefined,
            label: lookup_de[id],
            link: `/entities/${id}`,
            coding: codings[id],
          };
        };

        const parseTimeValue = (
          occ: Claim | StatementRaw
        ): Omit<TimeValue, keyof CommonValue> => {
          return {
            value: keyAccess<string>(occ, 'datavalue', 'value', 'time'),
          };
        };

        const parseStringValue = (
          occ: Claim | StatementRaw,
          currentHeadlineLevel: number
        ): Omit<StringValue, keyof CommonValue> => {
          const value = keyAccess<string>(occ, 'datavalue', 'value');
          const id = keyAccess<Property>(occ, 'property');
          // try {
          //   !embeddedStatement &&
          //     occ['qualifiers-order'] &&
          //     occ.qualifiers[occ['qualifiers-order'][0]][0].datavalue
          //       ?.value?.id;
          // } catch {
          //   debugger;
          // }
          const itemType =
            !embeddedStatement &&
            'qualifiers-order' in occ &&
            occ.qualifiers &&
            occ['qualifiers-order'] &&
            occ.qualifiers[occ['qualifiers-order'][0] as Property][0].datavalue
              ?.value?.id;
          const headingIndex = headings.findIndex(
            (heading) => heading === itemType
          );
          return {
            value,
            headline:
              headingIndex >= 0 && isTextGroup
                ? addHeadline(value, currentHeadlineLevel + headingIndex)
                : undefined,
            coding: codings[id],
            itemType,
          };
        };

        const parseUrlValue = (
          occ: StatementRaw | Claim
        ): Omit<UrlValue, keyof CommonValue> => {
          return {
            value: keyAccess<string>(occ, 'datavalue', 'value'),
          };
        };

        const parsedStatements: PreMappedStatement[] = await Promise.all(statements.map(
          async (occs) => {
            const dataType = keyAccess<string>(occs[0], 'datatype');
            const simplifiedDataType =
              dataType === 'wikibase-item' ||
              dataType === 'wikibase-entityid' ||
              dataType === 'wikibase-property'
                ? 'wikibasePointer'
                : (dataType as DataType);
            const property = keyAccess<Property>(occs[0], 'property');
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
              [simplifiedDataType]: await Promise.all(occs.map(async (occ) => {
                const snakType = keyAccess<string>(occ, 'snaktype');
                if (snakType === 'novalue') {
                  return { noValue: true };
                } else if (snakType === 'somevalue') {
                  return { unknownValue: true };
                }
                const propertyId = keyAccess<Property>(occ, 'property');
                const embeddedEntityId = keyAccess<EntityId>(
                  occ,
                  'datavalue',
                  'value',
                  'id'
                );

                const hasEmbedding =
                  (propertyId === Property['example(s)'] ||
                    propertyId === Property['embedded(item)'] ||
                    propertyId === Property['embedded(property)']) &&
                  !prevParsedEntities.some((id) => id === embeddedEntityId);

                const nextHeaderLevel =
                  currentHeadlineLevel + (hasHeadline ? 1 : 0);

                const dataTypeSpecifics =
                  simplifiedDataType === 'wikibasePointer'
                    ? parseWikibaseValue(occ, nextHeaderLevel)
                    : simplifiedDataType === 'time'
                    ? parseTimeValue(occ)
                    : simplifiedDataType === 'url'
                    ? parseUrlValue(occ)
                    : parseStringValue(occ, nextHeaderLevel);

                const j = {
                  ...dataTypeSpecifics,
                  references:
                    'references' in occ && occ.references
                      ? await parseReferences(occ.references)
                      : undefined,
                  embedded: hasEmbedding
                    ? (await parseRawEntity({
                        entityId: embeddedEntityId,
                        headlines,
                        currentHeadlineLevel: nextHeaderLevel,
                        prevParsedEntities: [...prevParsedEntities, entityId],
                        embedded: true,
                        data,
                        getRawEntityById,
                      }))?.entity
                    : undefined,
                  qualifiers:
                    'qualifiers' in occ && occ.qualifiers
                      ? await parseStatementProps(
                          (Object.keys(occ.qualifiers) as Property[]).map(
                            (qualiKey) =>
                              (occ as Required<Claim>).qualifiers[qualiKey]
                          ),
                          nextHeaderLevel,
                          { embeddedStatement: true, isTextGroup }
                        )
                      : undefined,
                };
                return j;
              })),
            };
          }
        ));
        return parsedStatements.map(stringMapper);
      };

      const enrichedParsedStatementProps = {
        header: await parseStatementProps(
          filterSort('header'),
          currentHeadlineLevel + 1,
          {
            isTopLevel: !embedded,
          }
        ),
        table: await parseStatementProps(
          filterSort('table'),
          currentHeadlineLevel + 1,
          {
            isTopLevel: !embedded,
          }
        ),
        text: await parseStatementProps(
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
    return {
      id: entityId,
      headline: !embedded
        ? addHeadline(
            entity.labels.de?.value,
            currentHeadlineLevel,
            elementOfId &&
              (lookup_en[elementOfId] as unknown as DataSource | undefined)
          )
        : undefined,
      label: !embedded ? entity.labels.de?.value : undefined, //todo, strip
      title:
        !embedded && elementOfId
          ? `${entity.labels.de?.value} | ${lookup_de[elementOfId]}`
          : undefined,
      pageType: elementOfId
        ? ({
            ...lookup_en[elementOfId],
            deLabel: lookup_de[elementOfId],
          } as PageType)
        : undefined,
      notation: notations[entityId]?.notation,
      statements: await statementProps(entity.claims),
      // logo:
      //   !embedded &&
      //   entity.claims[Property.logo],
    };
  };

  const parsedEntity = {
    ...(await entityProps()),
  };

  // console.log({ parsedEntity });

  return { entity: parsedEntity, headlines };
};

const stringMapper = (val: PreMappedStatement): Statement => {
  const stringTransform = (stringValues: StringValue[]) => {
    const groupReducer = (acc: StringValueContainer[], value: StringValue) => {
      const { itemType, ...otherValues } = value;
      if (
        acc.length > 0 &&
        acc[acc.length - 1].itemType === (itemType || 'default')
      ) {
        const prevAcc = [...acc];
        const lastEntry = prevAcc.pop() as StringValueContainer;
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
    };
    const groupedContent = stringValues.reduce(groupReducer, []);

    return groupedContent;
  };
  return val && 'string' in val && val.string
    ? {
        ...val,
        string: stringTransform(val.string),
      }
    : (val as unknown as Statement);
};
