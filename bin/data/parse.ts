import {
  readCodings,
  readDescriptions,
  readEntityIndex,
  readFields,
  readLabelDe,
  readLabelEn,
  readNotations,
  readRawData,
  readRdaProperty,
} from './read';
import {Property} from '../../types/property';
import {DataState, writeJSONFileAndType} from './utils';
import {NAMES} from './utils/names';
import {Name} from './types/name';
import {LabelEnRaw} from './types/raw/label-en';
import {DescriptionRaw} from './types/raw/description';
import {EntityIndexRaw} from './types/raw/entity-index';
import {EntityRaw} from './types/raw/entity';
import {EntityIndex} from '@/types-generated/entity-index';
import {RdaProperty} from '@/types-generated/rda-property';
import {Notation} from '@/types-generated/notation';
import {Coding9} from '@/types-generated/coding';
import {LabelDe} from '@/types-generated/label-de';
import {LabelEn} from '@/types-generated/label-en';
import {Description} from '@/types-generated/description';
import {Entity} from '@/types-generated/entity';
import {Field} from '@/types-generated/field';

const parseDescription = () => {
  console.log('\tParsing Description');
  return commonParseFunc<DescriptionRaw[], Description>(
    readDescriptions(),
    NAMES.description
  );
};

const parseLabelEn = () => {
  console.log('\tParsing LabelEn');
  return commonParseFunc<LabelEnRaw[], LabelEn>(readLabelEn(), NAMES.labelEn);
};

const parseLabelDe = () => {
  console.log('\tParsing LabelDe');
  const labels = readLabelDe();
  const parsedLabels = labels.reduce((acc, label) => {
    acc[label.eId.value] = label.elementLabel.value
      .split(' - ')
      .pop() as string;
    return acc;
  }, {} as LabelDe);
  writeJSONFileAndType(parsedLabels, NAMES.labelDe, DataState.parsed);
  return parsedLabels;
};

const parseCodings = () => {
  console.log('\tParsing Coding');
  const codings = readCodings();
  const parsedCodings = codings.reduce((acc, coding) => {
    acc[coding.eId.value] = {
      label: coding.elementLabel.value,
      coding: {
        format: coding.codingTypeLabel?.value
          ? {
            [coding.codingTypeLabel?.value]: coding.coding.value,
          }
          : {},
      },
    };
    return acc;
  }, {} as Coding9);
  writeJSONFileAndType(parsedCodings, NAMES.coding, DataState.parsed);
  return parsedCodings;
};

const parseNotations = () => {
  console.log('\tParsing Notation');
  const notations = readNotations();
  const parsedNotations = notations.reduce((acc, notation) => {
    acc[notation.eId.value] = {
      label: notation.elementLabel.value,
      notation: notation.notationLabel.value,
    };
    return acc;
  }, {} as Notation);
  writeJSONFileAndType(parsedNotations, NAMES.notation, DataState.parsed);
  return parsedNotations;
};

const commonParseFunc = <T extends any[], K>(data: T, name: Name): K => {
  console.log('\tParsing', name.type);
  const parsedData = data.reduce((acc: any, entry: any) => {
    acc[entry.eId.value] = {
      label: entry.elementLabel.value.toLowerCase().split(' ').join(''),
      assignmentId: entry.assignmentId?.value,
      assignmentLabel: entry.assignmentLabel?.value,
    };
    return acc;
  }, {});
  writeJSONFileAndType(parsedData, name, DataState.parsed);
  return parsedData;
};

const parseRdaProperties = (): RdaProperty[] => {
  console.log('\tParsing RdaProperties');
  const rdaProperties = readRdaProperty();
  const parsedRdaProperties = rdaProperties.reduce((acc, rdaProperty) => {
    return [
      ...acc,
      {
        id: rdaProperty.eId.value,
        label: rdaProperty.elementLabel.value,
        domainId: rdaProperty.assignmentId?.value,
        domainLabel: rdaProperty.assignmentLabel?.value
          .split(' - ')
          .pop() as string,
      },
    ];
  }, [] as RdaProperty[]);
  writeJSONFileAndType(
    parsedRdaProperties,
    NAMES.rdaProperty,
    DataState.parsed
  );
  return parsedRdaProperties;
};

// todo improve data structure
const parseFields = () => {
  console.log('\tParsing Fields');
  const fields = readFields();
  const rows = [];
  Object.keys(fields).map((key) => {
    // every field needs a Property ID
    fields[key]['id'] = key;
    rows.push(fields[key]);
  });
  writeJSONFileAndType(rows, NAMES.fields, DataState.parsed);
  return rows;
};

const parseEntities = (
  lookup_en: LabelEn,
  lookup_de: LabelDe,
  codings: Coding9,
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
    return {
      id: entityId,
      label: entity.labels.de?.value, //todo, strip
      description: 'de' in entity.descriptions && entity.descriptions.de.value,
      notation: notations[entityId]?.notation,
      statements: Object.keys(entity.claims).reduce((acc, key) => {
        const occurrences = entity.claims[key];
        return {
          ...acc,
          [lookup_en[key].label]: {
            id: key,
            link: `/entries/${key}`,
            label: lookup_de[key],
            format:
              key === Property.encoding && codings[key]
                ? codings[key].coding.format
                : undefined,
            coding: codings[key] && codings[key].coding,
            occurrences:
              occurrences &&
              occurrences.map((occurrence) => {
                const occurrenceId =
                  'datavalue' in occurrence.mainsnak &&
                  typeof occurrence.mainsnak.datavalue.value !== 'string' &&
                  (occurrence.mainsnak.datavalue?.value.id as keyof EntityRaw);
                const specifics = () => {
                  if (
                    occurrence.mainsnak.snaktype === 'value' &&
                    occurrenceId
                  ) {
                    return {
                      id: occurrenceId,
                      label: lookup_de[occurrenceId],
                      link: `/entries/${occurrenceId}`,
                    };
                  } else if (
                    occurrence.mainsnak.snaktype === 'value' &&
                    'datavalue' in occurrence.mainsnak &&
                    occurrence.mainsnak.datavalue?.value
                  ) {
                    return {
                      value: occurrence.mainsnak.datavalue.value,
                    };
                  } else {
                    return {};
                  }
                };
                const specifics2 = () => {
                  if (key === Property.subfields) {
                    return {
                      coding: occurrenceId && codings[occurrenceId].coding,
                    };
                  } else if (
                    (key === Property['example(s)'] ||
                      key === Property['embedded(item)'] ||
                      key === Property['embedded(property)']) &&
                    occurrenceId &&
                    occurrenceId !== entityId
                  ) {
                    return parseRawEntity(occurrenceId);
                  } else {
                    return {};
                  }
                };
                const specifics3 = () => {
                  if ('qualifiers' in occurrence && occurrence.qualifiers) {
                    return {
                      qualifiers: Object.keys(occurrence.qualifiers).reduce(
                        (acc, qualiKey) => {
                          return {
                            ...acc,
                            [lookup_en[qualiKey].label]: {
                              label: lookup_de[qualiKey],
                              id: qualiKey,
                              occurrences: occurrence.qualifiers[qualiKey]
                                .map((occurrence2: any) => {
                                  if (occurrence2.datavalue) {
                                    const occurrence2Id =
                                      occurrence2.datavalue.value.id;
                                    if (occurrence2Id) {
                                      if (
                                        (qualiKey === Property['example(s)'] ||
                                          qualiKey ===
                                            Property['embedded(item)'] ||
                                          qualiKey ===
                                            Property['embedded(property)']) &&
                                        occurrence2Id !== entityId
                                      ) {
                                        return parseRawEntity(occurrence2Id);
                                      } else {
                                        return {
                                          id: occurrence2Id,
                                          label: lookup_de[occurrence2Id],
                                          link: `/entries/${occurrence2Id}`,
                                          codings:
                                            codings[occurrence2Id]?.coding,
                                        };
                                      }
                                    } else if (
                                      occurrence2.datatype === 'time'
                                    ) {
                                      return {
                                        value: occurrence2.datavalue.value.time,
                                      };
                                    } else {
                                      return {
                                        value: occurrence2.datavalue.value,
                                      };
                                    }
                                  }
                                })
                                .filter((a) => a),
                              coding:
                                codings[qualiKey] && codings[qualiKey].coding,
                            },
                          };
                        },
                        {}
                      ),
                    };
                  }
                };
                return {
                  ...specifics(),
                  ...specifics2(),
                  ...specifics3(),
                  ...('references' in occurrence
                    ? {
                      references: occurrence.references.map((reference) => {
                        return Object.keys(reference.snaks).reduce(
                          (acc, refKey) => {
                            return {
                              ...acc,
                              [lookup_en[refKey].label]: {
                                id: refKey,
                                label: lookup_de[refKey],
                                value:
                                    reference.snaks[refKey][0].datavalue?.value,
                              },
                            };
                          },
                          {}
                        );
                      }),
                    }
                    : {}),
                };
              }),
          },
        };
      }, {}),
    };
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

export const entityIndex = () => {
  return commonParseFunc<EntityIndexRaw[], EntityIndex>(
    readEntityIndex(),
    NAMES.entityIndex
  );
}
export const parseRawData = () => {
  console.log('Data parsing is starting');
  parseDescription();
  parseRdaProperties();
  parseFields();
  parseEntities(
    parseLabelEn(),
    parseLabelDe(),
    parseCodings(),
    parseNotations()
  );
  console.log('Data parsing has finished');
};
