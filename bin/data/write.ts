import type { fetcher } from './fetch';
import type { parseAllFromRead } from './parse';
import { DataState, writeJSONFileAndType } from './utils';
import { NAMES } from './utils/names';

export const writer = (
  data:
    | Awaited<ReturnType<ReturnType<typeof fetcher>['fetchAll']>>
    | ReturnType<typeof parseAllFromRead>,
  dataState: DataState
) => {
  const entities = {
    all: () => {
      writeJSONFileAndType(data.entities.all, NAMES.entity, dataState);
    },
    // index: () => {
    //   writeJSONFileAndType(data.entities.index, NAMES.entity, dataState);
    // }
  };

  const fields = () => {
    writeJSONFileAndType(data.fields, NAMES.fields, dataState);
  };

  const labels = {
    de: () => writeJSONFileAndType(data.labels.de, NAMES.labelDe, dataState),
    en: () => writeJSONFileAndType(data.labels.en, NAMES.labelEn, dataState),
  };

  const notations = () =>
    writeJSONFileAndType(data.notations, NAMES.notation, dataState);
  const codings = () => {
    debugger
    writeJSONFileAndType(data.codings, NAMES.coding, dataState);
  }
  const descriptions = () =>
    writeJSONFileAndType(data.descriptions, NAMES.description, dataState);
  // const rdaRules = () =>
  //   writeJSONFileAndType(data.rdaRules, NAMES.rdaRule, dataState);
  const rdaProperties = () =>
    writeJSONFileAndType(data.rdaProperties, NAMES.rdaProperty, dataState);

  const writeAll = () => {
    entities.all();
    fields();
    labels.de();
    labels.en();
    notations();
    codings();
    descriptions();
    // rdaRules();
    rdaProperties();
  };

  return {
    entities,
    fields,
    labels,
    notations,
    codings,
    descriptions,
    // rdaRules,
    rdaProperties,
    writeAll,
  };
};
