import { Namespace } from '@/types/namespace';
import slugify from 'slugify';
import { ParseEntitiesProps } from '.';
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
import { Group, groupsDefinition } from './groups-definition';

type DataType = 'string' | 'wikibasePointer' | 'time' | 'url';
type PreMappedStatement = Omit<Statement, 'string'> & {
  string?: StringValue[];
};

const headings = [
  Item['First-order-subheading-(type-of-layout)'],
  Item['Second-order-subheading-(type-of-layout)'],
  Item['Third-order-subheading-(type-of-layout)'],
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
  console.log('\t\t\tParsing Entity', entityId);
  const { lookup_de, lookup_en, codings, notations } = data;
  const entity = await getRawEntityById(entityId);

  if (!entity) {
    console.warn(
      'entity not found:',
      entityId,
      '. But referenced in the dataset:',
      prevParsedEntities.join(', ')
    );
    return;
  }

  const addHeadline = (
    title: string,
    level: number,
    ignore = false,
    namespace?: Namespace
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

    if (!ignore) {
      headlines.push(namespace ? { ...headline, namespace } : headline);
    }

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

    const entityHasHeadline = !embedded && !isPropertyBlacklisted(entityId);

    const statementProps = async (
      occurrences: Record<EntityId, Claim[]>
    ): Promise<StatementsByGroup> => {
      const filterByGroup = (group: Group) =>
        groupsDefinition[group]
          .map((propertyKey) => occurrences[propertyKey])
          .filter((a) => a); // as unknown as Claim[];

      const sortByProperties = (claims: Claim[][], group: Group) =>
        claims.sort((occ1, occ2) =>
          groupsDefinition[group].indexOf(occ1[0].mainsnak.property) >
          groupsDefinition[group].indexOf(occ2[0].mainsnak.property)
            ? 1
            : -1
        );

      const parseStatementProps = async (
        statements: StatementRaw[][] | Claim[][],
        currentHeadlineLevel: number,
        { embeddedStatement = false, isTopLevel = false, noHeadline = false }
      ): Promise<Statement[]> => {
        const keyAccess = <T>(
          occ: any, //Claim | StatementRaw,
          ...propertyPath: string[]
        ): T => {
          return propertyPath.reduce(
            (acc, val) => acc[val as keyof typeof acc],
            'mainsnak' in occ ? occ.mainsnak : occ
          ) as T;
        };

        const parseReferences = async (references: Reference[]) => {
          const o = references
            .map((ref) =>
              Object.keys(ref.snaks).map(
                (refKey) => ref.snaks[refKey as keyof typeof ref.snaks]
              )
            )
            .flat() as StatementRaw[][];
          return await parseStatementProps(o, currentHeadlineLevel, {
            embeddedStatement: true,
            isTopLevel,
            noHeadline,
          });
        };

        const parseWikibaseValue = (
          occ: Claim | StatementRaw,
          currentHeadlineLevel: number
        ): Omit<WikiBaseValue, keyof CommonValue> => {
          const id = keyAccess<EntityId>(occ, 'datavalue', 'value', 'id');
          const hasHeadline =
            isTopLevel &&
            !isPropertyBlacklisted(id) &&
            'qualifiers' in occ &&
            occ.qualifiers;

          return {
            id,
            headline: hasHeadline
              ? addHeadline(lookup_de[id], currentHeadlineLevel, noHeadline)
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
          const property = keyAccess<Property>(occ, 'property');
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
          const hasHeadline =
            headingIndex >= 0 &&
            !isPropertyBlacklisted(itemType ?? property, 'headlines');

          return {
            value,
            headline: hasHeadline
              ? addHeadline(
                  value,
                  currentHeadlineLevel + headingIndex,
                  noHeadline
                )
              : undefined,
            coding: codings[property],
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

        const parsedStatements: PreMappedStatement[] = await Promise.all(
          statements.map(async (occs) => {
            const dataType = keyAccess<string>(occs[0], 'datatype');
            const simplifiedDataType =
              dataType === 'wikibase-item' ||
              dataType === 'wikibase-entityid' ||
              dataType === 'wikibase-property'
                ? 'wikibasePointer'
                : (dataType as DataType);
            const property = keyAccess<Property>(occs[0], 'property');
            const label = lookup_de[property];
            const hasHeadline = isTopLevel && !isPropertyBlacklisted(property);

            return {
              label,
              headline: hasHeadline
                ? addHeadline(label, currentHeadlineLevel, noHeadline)
                : undefined,
              property,
              [simplifiedDataType]: await Promise.all(
                occs.map(async (occ) => {
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
                      propertyId === Property['embedded-(item)'] ||
                      propertyId === Property['embedded-(property)']) &&
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

                  return {
                    ...dataTypeSpecifics,
                    references:
                      'references' in occ && occ.references
                        ? await parseReferences(occ.references)
                        : undefined,
                    embedded: hasEmbedding
                      ? (
                          await parseRawEntity({
                            entityId: embeddedEntityId,
                            headlines,
                            currentHeadlineLevel: nextHeaderLevel,
                            prevParsedEntities: [
                              ...prevParsedEntities,
                              entityId,
                            ],
                            embedded: true,
                            data,
                            getRawEntityById,
                          })
                        )?.entity
                      : undefined,
                    qualifiers:
                      'qualifiers' in occ && occ.qualifiers
                        ? await parseStatementProps(
                            (Object.keys(occ.qualifiers) as Property[]).map(
                              (qualiKey) =>
                                (occ as Required<Claim>).qualifiers[qualiKey]
                            ),
                            nextHeaderLevel,
                            {
                              embeddedStatement: true,
                              isTopLevel,
                              noHeadline,
                            }
                          )
                        : undefined,
                  };
                })
              ),
            };
          })
        );
        return parsedStatements.map(stringMapper);
      };

      const nextHeaderLevel =
        currentHeadlineLevel + (entityHasHeadline ? 1 : 0);

      const enrichedParsedStatementProps = {
        header: await parseStatementProps(
          sortByProperties(filterByGroup('header'), 'header'),
          nextHeaderLevel,
          {
            isTopLevel: !embedded,
          }
        ),
        table: await parseStatementProps(
          sortByProperties(filterByGroup('table'), 'table'),
          nextHeaderLevel,
          {
            isTopLevel: !embedded,
            noHeadline: true,
          }
        ),
        text: await parseStatementProps(
          sortByProperties(
            // filter props from groupsDefinition header
            Object.entries(occurrences).reduce((acc, [_entityId, occ]) => {
              if (
                !groupsDefinition.header.includes(occ[0].mainsnak.property) &&
                !groupsDefinition.table.includes(occ[0].mainsnak.property)
              ) {
                acc.push(occ);
              }
              return acc;
            }, [] as Claim[][]),
            'text'
          ),
          nextHeaderLevel,
          {
            isTopLevel: !embedded,
          }
        ),
      };
      return enrichedParsedStatementProps;
    };
    const label = lookup_de[entityId] ?? entity.labels.de?.value;

    return {
      id: entityId,
      headline: entityHasHeadline
        ? addHeadline(
            label,
            currentHeadlineLevel,
            false,
            elementOfId &&
              (lookup_en[elementOfId] as unknown as Namespace | undefined)
          )
        : undefined,
      label: !embedded ? label : undefined,
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
