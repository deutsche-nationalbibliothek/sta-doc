import {
  readCodings,
  readDescriptions,
  readEntityIndex,
  readFields,
  readLabelDe,
  readLabelEn,
  readNotations,
  readRdaProperty,
} from '../read';
import { DataState, readJSONFile, writeJSONFileAndType } from '../utils';
import { NAMES } from '../utils/names';
import { Name } from '../types/name';
import { LabelEnRaw } from '../types/raw/label-en';
import { DescriptionRaw } from '../types/raw/description';
import { EntityIndexRaw } from '../types/raw/entity-index';
import { EntityIndex } from '@/types-generated/entity-index';
import { RdaProperty } from '@/types-generated/rda-property';
import { Notation } from '@/types-generated/notation';
import { LabelDe } from '@/types-generated/label-de';
import { LabelEn } from '@/types-generated/label-en';
import { Description } from '@/types-generated/description';
import { Codings } from '@/types/entry';
import { parseEntities } from '../parse/entities';

const parseDescription = () => {
  return commonParseFunc<DescriptionRaw[], Description>(
    readDescriptions(),
    NAMES.description
  );
};

const parseLabelEn = () => {
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
    if (coding.codingTypeLabel) {
      acc[coding.eId.value] = acc[coding.eId.value] || {
        label: coding.elementLabel.value,
        PICA3: [],
        'PICA+': [],
        'MARC 21 Format für Normdaten': [],
        'GND-Ontologie': [],
      };
      acc[coding.eId.value][coding.codingTypeLabel.value] =
        acc[coding.eId.value][coding.codingTypeLabel.value] || [];
      acc[coding.eId.value][coding.codingTypeLabel.value as CodingKey].find(
        (codingValue) => codingValue === coding.coding.value
      ) ||
        acc[coding.eId.value][coding.codingTypeLabel.value as CodingKey].push(
          coding.coding.value
        );
    } else {
      console.warn('Coding without codingTypeLabel', coding.eId.value);
    }
    return acc;
  }, {} as Codings);
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

export const entityIndex = () => {
  return commonParseFunc<EntityIndexRaw[], EntityIndex>(
    readEntityIndex(),
    NAMES.entityIndex
  );
};

export const parseRawData = () => {
  console.log('Data parsing is starting');
  // parseDescription();
  // parseRdaProperties();
  // parseFields();
  parseEntities(
    readJSONFile(NAMES.labelEn, DataState.parsed),
    readJSONFile(NAMES.labelDe, DataState.parsed),
    readJSONFile(NAMES.coding, DataState.parsed),
    readJSONFile(NAMES.notation, DataState.parsed)
    // parseLabelEn(),
    // parseLabelDe(),
    // parseCodings(),
    // parseNotations()
  );
  console.log('Data parsing has finished');
};
