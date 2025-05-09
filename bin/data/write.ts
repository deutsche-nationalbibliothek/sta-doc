import { PropertiesItemsList } from '../../types/parsed/property-item-list';
import { EntitiesRaw } from '../../types/raw/entity';
import type { fetcher } from './fetcher';
import type { ParsedAllFromRead } from './parse';
import { DataState, writeJSONFile } from './utils';
import { writeFile } from './utils/fs';
import { NAMES } from './utils/names';

export const writeSingleRaw = (data: Partial<EntitiesRaw>) => {
  writeJSONFile(data, NAMES.entityDe, DataState.raw);
};

export const writeRaw = (
  data: Partial<Awaited<ReturnType<ReturnType<typeof fetcher>['fetchAll']>>>
) => {
  const entities = {
    all: () => {
      data.entities &&
        writeJSONFile(data.entities.all, NAMES.entity, DataState.raw);
    },
    index: () => {
      data.entities &&
        writeJSONFile(data.entities.index, NAMES.entityIndex, DataState.raw);
    },
  };

  const fields = () => {
    writeJSONFile(data.fields, NAMES.fields, DataState.raw);
  };

  const labels = {
    de: () =>
      data.labels &&
      writeJSONFile(data.labels.de, NAMES.labelDe, DataState.raw),
    en: () =>
      data.labels &&
      writeJSONFile(data.labels.en, NAMES.labelEn, DataState.raw),
    fr: () =>
      data.labels &&
      writeJSONFile(data.labels.fr, NAMES.labelFr, DataState.raw),
  };

  const propertyTypes = () =>
    writeJSONFile(data.propertyTypes, NAMES.propertyType, DataState.raw);
  const staNotations = () =>
    writeJSONFile(data.staNotations, NAMES.staNotation, DataState.raw);
  const schemas = () =>
    writeJSONFile(data.schemas, NAMES.schema, DataState.raw);
  const codings = () => {
    writeJSONFile(data.codings, NAMES.coding, DataState.raw);
  };
  const descriptions = () =>
    writeJSONFile(data.descriptions, NAMES.description, DataState.raw);
  // const rdaRules = () =>
  //   writeJSONFile(data.rdaRules, NAMES.rdaRule, DataState.raw);
  const rdaProperties = () =>
    writeJSONFile(data.rdaProperties, NAMES.rdaProperty, DataState.raw);

  const rdaElementStatuses = () =>
    writeJSONFile(
      data.rdaElementStatuses,
      NAMES.rdaElementStatuses,
      DataState.raw
    );

  const writeAll = () => {
    entities.index();
    entities.all();
    fields();
    labels.de();
    labels.en();
    labels.fr();
    propertyTypes();
    staNotations();
    schemas();
    codings();
    descriptions();
    rdaProperties();
    rdaElementStatuses();
  };

  return {
    entities,
    fields,
    labels,
    propertyTypes,
    staNotations,
    schemas,
    codings,
    descriptions,
    // rdaRules,
    rdaProperties,
    rdaElementStatuses,
    writeAll,
    // propertiesItemsList,
  };
};

export const writeParsed = (data: Partial<ParsedAllFromRead>) => {
  const entities = {
    de: () => {
      data.entities &&
        writeJSONFile(data.entities.all, NAMES.entity, DataState.parsed);
    },
    fr: () => {
      data.entities &&
        writeJSONFile(data.entities.all, NAMES.entityFr, DataState.parsed);
    },
    index: () => {
      data.entities &&
        writeJSONFile(data.entities.index, NAMES.entityIndex, DataState.parsed);
    },
  };

  const fields = () => {
    writeJSONFile(data.fields, NAMES.fields, DataState.parsed);
  };

  const labels = () => {
      data.labels && data.labels.de &&
      writeJSONFile(data.labels.de, NAMES.labelDe, DataState.parsed);
      data.labels && data.labels.en &&
      writeJSONFile(data.labels.en, NAMES.labelEn, DataState.parsed);
      data.labels && data.labels.fr &&
      writeJSONFile(data.labels.fr, NAMES.labelFr, DataState.parsed);
  };

  const staNotations = () =>
    writeJSONFile(data.staNotations, NAMES.staNotation, DataState.parsed);
  const schemas = () =>
    writeJSONFile(data.schemas, NAMES.schema, DataState.parsed);
  const codings = () => {
    writeJSONFile(data.codings, NAMES.coding, DataState.parsed);
  };
  const descriptions = () =>
    writeJSONFile(data.descriptions, NAMES.description, DataState.parsed);
  // const rdaRules = () =>
  //   writeJSONFile(data.rdaRules, NAMES.rdaRule, DataState.parsed);
  const propertyTypes= () =>
    writeJSONFile(data.propertyTypes, NAMES.propertyType, DataState.parsed);
  const rdaElementStatuses = () =>
    writeJSONFile(
      data.rdaElementStatuses,
      NAMES.rdaElementStatuses,
      DataState.parsed
    );
  const rdaProperties = () =>
    writeJSONFile(data.rdaProperties, NAMES.rdaProperty, DataState.parsed);

  const writeAll = () => {
    entities.index();
    entities.de();
    entities.fr();
    fields();
    labels();
    propertyTypes();
    staNotations();
    schemas();
    codings();
    descriptions();
    rdaElementStatuses();
    // rdaRules();
    rdaProperties();
  };

  return {
    entities,
    fields,
    labels,
    propertyTypes,
    staNotations,
    schemas,
    codings,
    descriptions,
    // rdaRules,
    rdaProperties,
    rdaElementStatuses,
    writeAll,
    // propertiesItemsList,
  };
};

export const writer = {
  raw: writeRaw,
  rawSingle: writeSingleRaw,
  parsed: writeParsed,
};

export const propertiesItemsList = (
  propertiesItemsList_: PropertiesItemsList
) => {
  writeFile(propertiesItemsList_.items, './types/item.ts');
  writeFile(propertiesItemsList_.properties, './types/property.ts');
};
