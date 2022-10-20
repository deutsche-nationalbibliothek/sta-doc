import { readRawData } from '../read';
import { Property } from '../../../types/property';
import { DataState, writeJSONFileAndType } from '../utils';
import { EntityRaw } from '../types/raw/entity';
import { Notation } from '@/types-generated/notation';
import { LabelDe } from '@/types-generated/label-de';
import { LabelEn } from '@/types-generated/label-en';
import { Entity } from '@/types-generated/entity';
import { Item } from '../../../types/item';
import { Codings } from '@/types/entry';
import { NAMES } from '../utils/names';

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
        console.warn('no entity.claims for', entityId);
        return {}
      }
      const elementOf: Item =
        entity.claims[Property.elementof][0].mainsnak.datavalue.value.id;

      const statementProps = (occurrences) => {
        const filterSort = (domain: string) => {
          const itemGroup = itemGroups[elementOf]
            ? itemGroups[elementOf]
            : itemGroups['default-template']
          return itemGroup[domain]
            .map((propertyKey) => occurrences[propertyKey])
            .filter((a) => a)
            .sort(
              (occ1, occ2) =>
                itemGroup[domain].indexOf(
                  occ1[0].mainsnak.property
                ) >
                itemGroup[domain].indexOf(occ2[0].mainsnak.property)
            );
        }

        const parseStatementProps = (statement, inQualifier = false) => {
          const keyAccess = (occ, ...propertyPath: string[]) => {
            // try {
            return propertyPath.reduce(
              (acc, val) => acc[val],
              inQualifier ? occ : occ.mainsnak
            )
            // } catch (e) {
            //   console.error('Key Access threw an Error on', propertyPath.join('.'), 'while using', inQualifier ? 'occ' : 'occ.mainsnak', 'with', occ)
            //   console.error(e)
            //   throw (e)
            // }
          };

          const parseWikibasePointer = (occ) => {
            const id = keyAccess(occ, 'datavalue', 'value', 'id');
            return {
              id: id,
              label: lookup_de[id],
              link: `/entries/${id}`,
              coding: codings[id],
              embedded:
                (id === Property['example(s)'] ||
                  id === Property['embedded(item)'] ||
                  id === Property['embedded(property)']) &&
                id,
              qualifiers:
                occ.qualifiers &&
                parseStatementProps(
                  Object.keys(occ.qualifiers).map(
                    (qualiKey) => occ.qualifiers[qualiKey]
                  ),
                  true
                ),
              references:
                occ.references &&
                parseStatementProps(
                  occ.references
                    .map((ref) =>
                      Object.keys(ref.snaks).map((refKey) => ref.snaks[refKey])
                    )
                    .flat(),
                  true
                ),
            };
          };
          const parseTimeValue = (occ) => {
            return {
              value: keyAccess(occ, 'datavalue', 'value', 'time'),
            };
          };
          const parseStringValue = (occ) => {
            let value: string;
            try {
              value = keyAccess(occ, 'datavalue', 'value')
            } catch (e) {
              console.warn('No Value in datvalue.value', occ)
              return undefined
            }
            // if (keyAccess(occ, 'snaktype') === 'novalue') {
            //   return undefined
            // }
            return {
              value,
              itemType:
                !inQualifier &&
                occ['qualifiers-order'] &&
                occ.qualifiers[occ['qualifiers-order'][0]][0].datavalue?.value.id,
            };
          };
          const parseUrlValue = (occ) => {
            return {
              value: keyAccess(occ, 'datavalue', 'value'),
            };
          };
          const parsedStatements = statement.map((occs) => {
            const dataType = keyAccess(occs[0], 'datatype');
            return {
              label: lookup_de[keyAccess(occs[0], 'property')],
              [dataType]: occs.map((occ) => {
                return {
                  ...(dataType === 'wikibase-item' ||
                    dataType === 'wikibase-property'
                    ? parseWikibasePointer(occ)
                    : dataType === 'time'
                      ? parseTimeValue(occ)
                      : dataType === 'url'
                        ? parseUrlValue(occ)
                        : parseStringValue(occ)),
                  occ,
                };
              }),
            };
          });
          return parsedStatements;
        };

        const enrichedParsedStatementProps = {
          table: parseStatementProps(filterSort('table')),
          text: parseStatementProps(filterSort('text')).map((val) => {
            const stringTransform = () => {
              const groupedContent = val.string.reduce((acc, value) => {
                if (
                  acc.length > 0 &&
                  acc[acc.length - 1].itemType === (value.itemType || 'default')
                ) {
                  const prevAcc = [...acc];
                  const lastEntry = prevAcc.pop();
                  return [
                    ...prevAcc,
                    { ...lastEntry, values: [...lastEntry.values, value] },
                  ];
                } else {
                  return [
                    ...acc,
                    { itemType: value.itemType || 'default', values: [value] },
                  ];
                }
              }, []);

              const headings = [
                Item.firstordersubheading,
                Item.secondordersubheading,
                Item.thirdordersubheading,
              ];
              const relativeHeadlineEnhancement = groupedContent.reduce(
                (acc, value) => {
                  const currenHeadingIndex = headings.indexOf(value.itemType);
                  acc = [
                    ...acc,
                    {
                      relativeHeadline:
                        currenHeadingIndex >= 0
                          ? currenHeadingIndex + 1
                          : undefined,
                      ...value,
                    },
                  ];
                  return acc;
                },
                []
              );

              return relativeHeadlineEnhancement;
            };
            return val.string ? { ...val, string: stringTransform() } : val;
          }),
        };
        return enrichedParsedStatementProps;
      };

      return {
        id: entityId,
        label: entity.labels.de?.value, //todo, strip
        title: `${entity.labels.de?.value} ${lookup_de[elementOf]}`,
        pageType: lookup_en[elementOf],
        description:
          'de' in entity.descriptions
            ? entity.descriptions.de.value
            : undefined,
        notation: notations[entityId]?.notation,
        statements: statementProps(entity.claims),
        logo:
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
    table: [Property.elements],
    text: [
      Property.description,
      Property.elements,
      Property.sourcesofinformation,
      Property['description(attheend)'],
    ],
  },
  ['default-template']: {
    // default renders tableProps, but NOT restProps like above
    table: [
      // todo, add later
    ],
    text: [
      // Zugehörigkeit innerhalb der Namensräume
      Property['schema'],
      Property['elementof'],
      Property['haselement(item)'],
      Property['haselement(property)'],
      // Eigenschaften für den Namensraum DACH-Dokumentation
      Property['definition'],
      Property['encoding'],
      Property['entitytype/domain'],
      Property['subclassof'],
      Property['subordinateclasses'],
      Property['parentproperty'],
      Property['subproperties'],
      Property['inverseproperty'],
      Property['embedded(item)'],
      Property['embeddedin(property)'],
      Property['embeddedin(item)'],
      Property['description'],
      Property['type'],
      Property['repetition'],
      Property['permitedvalues'],
      Property['example(s)'],
      Property['url'],
      Property['typeoflayout'],
      Property['see(item)'],
      Property['see(property)'],
      Property['annotation'],
      // Eigenschaften für den Namensraum RDA-Dokumentation
      Property['standardelementfor'],
      Property['recordingmethod'],
      Property['sourcesofinformation'],
      Property['basicrules'],
      Property['specialrules'],
      // 'P387', // todo, doesnt exist in Property enum type
      // Eigenschaften für den Namensraum GND-Datenmodell
      Property['datafields'],
      Property['subfields'],
      Property['validation'],
      Property['implementationprovisions'],
      Property['applicablefordatafield'],
      Property['applicablefortypeofentity'],
      Property['authorizations'],
      Property['languageofthestatement'],
      Property['wb-connection'],
      Property['permittedingndclass'],
      Property['relationtogndclass'],
      // Datenfelder
      // Idents & Codes
      Property['sourceanddateoffirstentry'],
      Property['sourceanddateoflastchange'],
      Property['sourceanddateofthelaststatusassignment'],
      Property['typeofrecord'],
      Property['gndidentifier'],
      Property['entitycode'],
      Property['changecoding'],
      Property['partialstockidentification'],
      Property['usageindicator'],
      Property['swdnumberinthegkddataset'],
      Property['otherstandardnumbers'],
      Property['gkdnumberintheswddataset'],
      Property['geographicalcoordinates'],
      Property['gndnumber'],
      Property['oldstandardnumber'],
      Property['catalogingsource'],
      Property['countrycode'],
      Property['gndclassification'],
      Property['ddcnotation'],
      Property['outdatedddcnotation'],
      // Vorzugsbenennungen
      Property['preferredname:personorfamily'],
      Property['preferredname:corporatebody'],
      Property['preferredname:conference'],
      Property['preferredtitle:work'],
      Property['preferredname:subjectheading'],
      Property['preferredname:place'],
      // sonstige identifizierende Merkmale
      Property['markerforthematch-and-mergeprocedure'],
      Property['keywordstobelinkedinreferencerecords'],
      Property['contenttype'],
      Property['mediatype'],
      Property['carriertype'],
      Property['gender'],
      Property['languagecodeaccordingtoiso639-2/b'],
      Property['typeofwork'],
      Property['mediumofperformanceofmusicalcontent'],
      Property['numericalidentificationofamusicalwork'],
      Property['keyofmusic'],
      // Abweichende Benennungen
      Property['variantnameofapersonorfamily'],
      Property['variantname:corporatebody'],
      Property['variantname:conference'],
      Property['alternativetitle:work'],
      Property['alternativedenomination:subjectterm'],
      Property['variantname:geografikum'],
      // Beziehungen
      Property['relationship:personorfamily'],
      Property['relationship:corporatebody'],
      Property['relationship:conference'],
      Property['relationship:work'],
      Property['relationship:time'],
      Property['relationship:subjectterm'],
      Property['relationship:place'],
      Property['editorialcomments'],
      // Quellenangaben und unstrukturierte Beschreibungen
      Property['sources'],
      Property['bibliographicinformation'],
      Property['negativelyviewedsources'],
      Property['definitions'],
      Property['biographical,historicalandotherinformation'],
      Property['instructionsforuse'],
      Property[
      'numberandpreferrednameorpreferrednamingofthetargetdatasetincaseofdatasetredirection'
      ],
      Property[
      'numberandpreferrednameorpreferrednamingofthetargetsetwhensplittingdatasets'
      ],
      // Vorzugsbenennungen in anderen Datenbeständen
      Property[
      'personorfamily-preferrednameinanotherdatabaseorinoriginalwrittenform'
      ],
      Property[
      'corporatebody-preferrednameinanotherdatabaseororiginalwrittenform'
      ],
      Property[
      'conference-preferrednameinanotherdatabaseororiginalwrittenform'
      ],
      Property['subjectheading-preferredterminanotherdatabase'],
      Property['place-preferrednameinanotherdatabaseorinoriginalwrittenform'],
      // Geschäftsgangsdaten
      Property['internalidentificationnumber(ppn)'],
      Property['mailbox'],
      Property['cataloginginstitution'],
      Property['oldpreferredformofthenameorthedesignation'],
      Property['sortingnameinthegermanexilearchive'],
      Property['errormessagesfromtheautomaticlinking'],
    ],
  },
};
