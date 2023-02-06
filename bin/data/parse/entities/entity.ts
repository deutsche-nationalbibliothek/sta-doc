import { Namespace } from '../../../../types/namespace';
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
import {
  Group,
  defaultGroupsDefinition,
  rdaRessourceTypeGroups,
} from './groups-definition';
import { groupBy, omit, compact } from 'lodash';
import namespaceConfig from '../../../../config/namespace';

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
  isRdaRessourceEntityParam?: boolean;
}

export const parseRawEntity = ({
  entityId,
  data,
  getRawEntityById,
  headlines = [],
  currentHeadlineLevel = 1,
  prevParsedEntities = [],
  embedded = false,
  isRdaRessourceEntityParam = false,
}: ParseEntityProps): EntityEntry | undefined => {
  console.log('\t\t\tParsing Entity', entityId);

  const { lookup_de, lookup_en, codings, staNotations, fields, schemas } = data;

  const entity = getRawEntityById(entityId);

  if (!entity) {
    console.warn(
      '\t\t\tentity not found:',
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

  const entityProps = (): Entity | void => {
    const namespace = namespaceConfig.map[schemas[entityId]];
    const elementOfId: Item =
      entity &&
      entity.claims[Property['Element-of']] &&
      entity.claims[Property['Element-of']][0].mainsnak.datavalue?.value.id;

    if (!elementOfId) {
      console.warn(
        '\t\t\tno entity.claims with Property.elementof for',
        entityId
      );
      // return undefined;
    }

    if (namespaceConfig.notUsed.includes(namespace)) {
      console.warn(
        '\t\t\tnamespace',
        namespace,
        'not used, ignoring entity',
        entityId
      );
      return undefined;
    }

    const isRdaRessourceEntity =
      (entity.claims[Property.Elements] && !embedded) ||
      isRdaRessourceEntityParam;

    const entityHasHeadline = !embedded && !isPropertyBlacklisted(entityId);

    const relevantGroup = isRdaRessourceEntity
      ? rdaRessourceTypeGroups
      : defaultGroupsDefinition;

    const statementProps = (
      occurrences: Record<EntityId, Claim[]>
    ): StatementsByGroup => {
      const filterByGroup = (group: Group) =>
        compact(
          relevantGroup[group].map(
            (propertyKey) =>
              propertyKey in occurrences &&
              occurrences[propertyKey].map(
                (occ) => occ && { ...occ, parentProperty: propertyKey }
              )
          )
        );

      const sortByProperties = (claims: Claim[][], group: Group) =>
        claims.sort((occ1, occ2) =>
          relevantGroup[group].indexOf(occ1[0].mainsnak.property) >
          relevantGroup[group].indexOf(occ2[0].mainsnak.property)
            ? 1
            : -1
        );

      const parseStatementProps = (
        statements: StatementRaw[][] | Claim[][],
        currentHeadlineLevel: number,
        { embeddedStatement = false, isTopLevel = false, noHeadline = false }
      ): Statement[] => {
        const keyAccess = <T>(
          occ: any, //Claim | StatementRaw,
          ...propertyPath: string[]
        ): T => {
          return propertyPath.reduce(
            (acc, val) => acc[val as keyof typeof acc],
            'mainsnak' in occ ? occ.mainsnak : occ
          ) as T;
        };

        const parseReferences = (references: Reference[]) => {
          const o = references
            .map((ref) =>
              Object.keys(ref.snaks).map(
                (refKey) => ref.snaks[refKey as keyof typeof ref.snaks]
              )
            )
            .flat() as StatementRaw[][];
          return parseStatementProps(o, currentHeadlineLevel, {
            embeddedStatement: true,
            isTopLevel,
            noHeadline,
          });
        };

        const parseWikibaseValue = (
          occ: Claim | StatementRaw,
          currentHeadlineLevel: number,
          addStaStatement = false
        ): Omit<WikiBaseValue, keyof CommonValue> | void => {
          const id = keyAccess<EntityId>(occ, 'datavalue', 'value', 'id');
          const hasHeadline =
            isTopLevel &&
            !isPropertyBlacklisted(id) &&
            'qualifiers' in occ &&
            occ.qualifiers;

          const pointingNamespace = namespaceConfig.map[schemas[id]];

          if (namespaceConfig.notUsed.includes(pointingNamespace)) {
            return;
          }

          return {
            id,
            headline: hasHeadline
              ? addHeadline(
                  lookup_de[id],
                  currentHeadlineLevel,
                  noHeadline,
                  pointingNamespace
                )
              : undefined,
            label: lookup_de[id],
            link: `/entities/${id}`,
            namespace: pointingNamespace,
            staNotationLabel:
              addStaStatement && id in staNotations
                ? staNotations[id].label.toUpperCase()
                : undefined,
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

        const isRdaRessourceEntity =
          (entity.claims[Property.Elements] && !embedded) ||
          isRdaRessourceEntityParam;

        const parsedStatements: PreMappedStatement[] = statements
          .map((occs) => {
            const dataType = keyAccess<string>(occs[0], 'datatype');
            const simplifiedDataType =
              dataType === 'wikibase-item' ||
              dataType === 'wikibase-entityid' ||
              dataType === 'wikibase-property'
                ? 'wikibasePointer'
                : (dataType as DataType);

            const property = keyAccess<Property>(occs[0], 'property');
            const label = lookup_de[property];

            const statementNamespace = namespaceConfig.map[schemas[property]];
            if (
              isPropertyBlacklisted(property, 'property') ||
              namespaceConfig.notUsed.includes(statementNamespace)
            ) {
              return undefined;
            }

            const isElementsPropOnRdaRessourceType =
              occs[0].parentProperty === Property.Elements &&
              isRdaRessourceEntity;

            const hasHeadline =
              isTopLevel &&
              !isPropertyBlacklisted(property) &&
              !isElementsPropOnRdaRessourceType;

            // const statementNamespace = namespaceConfig.map[schemas[property]];
            // if (namespaceConfig.notUsed.includes(statementNamespace)) {
            //   return;
            // }

            return {
              label,
              headline: hasHeadline
                ? addHeadline(
                    label,
                    currentHeadlineLevel,
                    noHeadline,
                    statementNamespace
                  )
                : undefined,
              property,
              namespace: statementNamespace,
              [simplifiedDataType]: occs.map((occ) => {
                const snakType = keyAccess<string>(occ, 'snaktype');
                if (snakType === 'novalue') {
                  return { noValue: true };
                } else if (snakType === 'somevalue') {
                  return { unknownValue: true };
                }

                const value = keyAccess<string>(occ, 'datavalue', 'value');
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

                const embedded = hasEmbedding
                  ? parseRawEntity({
                      entityId: embeddedEntityId,
                      headlines,
                      currentHeadlineLevel: nextHeaderLevel,
                      prevParsedEntities: [
                        ...prevParsedEntities,
                        entityId,
                        embeddedEntityId,
                      ],
                      isRdaRessourceEntityParam: isRdaRessourceEntity,
                      embedded: true,
                      data,
                      getRawEntityById,
                    })?.entity
                  : undefined;

                const dataTypeSpecifics =
                  simplifiedDataType === 'wikibasePointer'
                    ? parseWikibaseValue(
                        occ,
                        nextHeaderLevel +
                          (isElementsPropOnRdaRessourceType ? 1 : 0),
                        property === Property.Elements
                      )
                    : simplifiedDataType === 'time'
                    ? parseTimeValue(occ)
                    : simplifiedDataType === 'url'
                    ? parseUrlValue(occ)
                    : parseStringValue(occ, nextHeaderLevel);

                const qualifiers =
                  'qualifiers' in occ && occ.qualifiers
                    ? parseStatementProps(
                        (Object.keys(occ.qualifiers) as Property[])
                          .filter((x) => !isPropertyBlacklisted(x, 'qualifier'))
                          .map(
                            (qualiKey) =>
                              (occ as Required<Claim>).qualifiers[qualiKey]
                          ),
                        nextHeaderLevel +
                          (isElementsPropOnRdaRessourceType ? 1 : 0),
                        {
                          embeddedStatement: true,
                          isTopLevel,
                          noHeadline,
                        }
                      )
                    : undefined;

                return {
                  ...(dataTypeSpecifics ?? {}),
                  references:
                    'references' in occ && occ.references
                      ? parseReferences(occ.references)
                      : undefined,
                  embedded,
                  qualifiers,
                };
              }),
            };
          })
          .filter((a) => a);
        return parsedStatements.map(stringMapper);
      };

      const nextHeaderLevel = currentHeadlineLevel + 1;

      const reorganiseRdaRessourceType = () => {
        const releavantClaims = sortByProperties(filterByGroup('text'), 'text');
        const claimsReducer = (acc, statements) => {
          const elementsStatement =
            isRdaRessourceEntity &&
            statements[0].parentProperty === Property.Elements;

          if (elementsStatement) {
            const wemiGroups = groupBy(statements, (occs) =>
              occs.qualifiers && Property['WEMI-level'] in occs.qualifiers
                ? lookup_de[
                    occs.qualifiers[Property['WEMI-level']][0]?.datavalue.value
                      .id
                  ]
                : 'Kein Wert'
            );

            const wemiMapped = Object.keys(wemiGroups)
              .filter((a) => a !== 'Kein Wert')
              .map((wemiLabel) => {
                const occs = wemiGroups[wemiLabel];
                if (
                  'qualifiers' in occs[0] &&
                  Property['WEMI-level'] in occs[0].qualifiers
                ) {
                  const wemiLevel =
                    occs[0].qualifiers[Property['WEMI-level']][0];

                  const qualifiersWhiteList = [
                    Property['Title-proper'],
                    Property.Status,
                    Property.Repetition,
                    Property.description,
                    Property['embedded-(item)'],
                  ];

                  const filterQualifiers = (
                    data: Record<EntityId, StatementRaw[]>
                  ): StatementRaw[][] => {
                    return qualifiersWhiteList
                      .map(
                        (propertyKey) =>
                          propertyKey in data &&
                          data[propertyKey].map(
                            (occ) =>
                              occ && {
                                ...occ,
                                parentProperty: propertyKey,
                              }
                          )
                      )
                      .filter((a) => a); // as unknown as Claim[];
                  };

                  const sortQualifiers = (claims: StatementRaw[][]) => {
                    return claims.sort((occ1, occ2) => {
                      return qualifiersWhiteList.indexOf(occ1[0].property) >
                        qualifiersWhiteList.indexOf(occ2[0].property)
                        ? 1
                        : -1;
                    });
                  };
                  return {
                    ...wemiLevel,
                    qualifiers: occs.reduce((acc, occ) => {
                      const property = occ.mainsnak.property;
                      if (property in acc) {
                        const qualifiers = sortQualifiers(
                          filterQualifiers(
                            omit(
                              occ.qualifiers,
                              Property['WEMI-level']
                            ) as Record<EntityId, StatementRaw[]>
                          )
                        );
                        acc[property] = [
                          ...acc[property],
                          {
                            ...occ,
                            qualifiers,
                          },
                        ];
                      } else {
                        acc = {
                          ...acc,
                          [property]: [
                            {
                              ...occ,
                              qualifiers: omit(
                                occ.qualifiers,
                                Property['WEMI-level']
                              ),
                            },
                          ],
                        };
                      }
                      return acc;
                    }, {}),
                    datatype: 'wikibase-property',
                  };
                } else {
                  return wemiGroups[wemiLabel];
                }
              });
            return [...acc, wemiMapped];
          } else {
            return [...acc, statements];
          }
        };

        return releavantClaims
          .reduce(claimsReducer, [])
          .filter((statements) => statements.length);
      };

      const enrichedParsedStatementProps = {
        header: parseStatementProps(
          sortByProperties(filterByGroup('header'), 'header'),
          nextHeaderLevel,
          {
            isTopLevel: !embedded,
          }
        ),
        table: parseStatementProps(
          sortByProperties(filterByGroup('table'), 'table'),
          nextHeaderLevel,
          {
            isTopLevel: !embedded,
            noHeadline: true,
          }
        ),
        text: parseStatementProps(
          isRdaRessourceEntity
            ? reorganiseRdaRessourceType()
            : sortByProperties(
                // filter props from groupsDefinition header
                Object.entries(occurrences).reduce((acc, [_entityId, occ]) => {
                  if (
                    !defaultGroupsDefinition.header.includes(
                      occ[0].mainsnak.property
                    ) &&
                    !defaultGroupsDefinition.table.includes(
                      occ[0].mainsnak.property
                    )
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

    const pageType = elementOfId
      ? ({
          ...lookup_en[elementOfId],
          deLabel: lookup_de[elementOfId],
        } as PageType)
      : undefined;

    return {
      id: entityId,
      headline: entityHasHeadline
        ? addHeadline(label, currentHeadlineLevel, false, namespace)
        : undefined,
      label: !embedded ? label : undefined,
      title:
        !embedded && elementOfId
          ? `${entity.labels.de?.value} | ${lookup_de[elementOfId]}`
          : undefined,
      pageType,
      namespace,
      field:
        pageType && pageType.id === Item['GND-data-field']
          ? fields.find((field) => field.id === entityId)
          : undefined,
      staNotationLabel:
        entityId in staNotations
          ? staNotations[entityId].label.toUpperCase()
          : undefined,
      statements: statementProps(entity.claims),
      // logo:
      //   !embedded &&
      //   entity.claims[Property.logo],
    };
  };

  const parsedEntity = entityProps();
  // const parsedEntity = {
  //   ...entityProps(),
  // };

  if (parsedEntity) {
    return { entity: parsedEntity, headlines };
  }
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
        const lastEntry = prevAcc.pop(); // as StringValueContainer;
        return [
          ...prevAcc,
          {
            ...lastEntry,
            values: lastEntry
              ? [...lastEntry.values, otherValues]
              : [otherValues],
          },
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
