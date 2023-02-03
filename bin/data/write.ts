import { PropertiesItemsList } from '../../types/parsed/property-item-list';
import type { fetcher } from './fetcher';
import type { parseAllFromRead } from './parse';
import { DataState, writeJSONFile } from './utils';
import { writeFile } from './utils/fs';
import { NAMES } from './utils/names';

export const writer = (
  data:
    | Awaited<ReturnType<ReturnType<typeof fetcher>['fetchAll']>>
    | ReturnType<typeof parseAllFromRead>,
  dataState: DataState
) => {
  const entities = {
    all: async () => {
      writeJSONFile(await data.entities.all, NAMES.entity, dataState);
    },
    // index: () => {
    //   writeJSONFile(data.entities.index, NAMES.entity, dataState);
    // }
  };

  const fields = () => {
    writeJSONFile(data.fields, NAMES.fields, dataState);
  };

  const labels = {
    de: () => writeJSONFile(data.labels.de, NAMES.labelDe, dataState),
    en: () => writeJSONFile(data.labels.en, NAMES.labelEn, dataState),
  };

  const staNotations = () =>
    writeJSONFile(data.staNotations, NAMES.staNotation, dataState);
  const schema = () =>
    writeJSONFile(data.schemas, NAMES.schema, dataState);
  const codings = () => {
    writeJSONFile(data.codings, NAMES.coding, dataState);
  };
  const descriptions = () =>
    writeJSONFile(data.descriptions, NAMES.description, dataState);
  // const rdaRules = () =>
  //   writeJSONFile(data.rdaRules, NAMES.rdaRule, dataState);
  const rdaProperties = () =>
    writeJSONFile(data.rdaProperties, NAMES.rdaProperty, dataState);

  const writeAll = () => {
    entities.all();
    fields();
    labels.de();
    labels.en();
    staNotations();
    schema();
    codings();
    descriptions();
    // rdaRules();
    rdaProperties();
  };

  return {
    entities,
    fields,
    labels,
    staNotations,
    schema,
    codings,
    descriptions,
    // rdaRules,
    rdaProperties,
    writeAll,
    propertiesItemsList,
  };
};

export const propertiesItemsList = (
  propertiesItemsList_: PropertiesItemsList
) => {
  writeFile(propertiesItemsList_.items, './types/item.ts');
  writeFile(propertiesItemsList_.properties, './types/property.ts');
};
