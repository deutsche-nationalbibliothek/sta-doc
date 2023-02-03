import { StaNotationsRaw } from '../../types/raw/sta-notation';
import { EntityId } from '../../types/entity-id';
import { SchemasRaw } from '../../types/raw/schema';
import { CodingRaw } from '../../types/raw/coding';
import { DescriptionRaws } from '../../types/raw/description';
import { EntitiesRaw } from '../../types/raw/entity';
import { EntitiesIndexRaw } from '../../types/raw/entity-index';
import { FieldsRaw } from '../../types/raw/field';
import { LabelDeRaws } from '../../types/raw/label-de';
import { LabelEnRaws } from '../../types/raw/label-en';
import { RdaPropertiesRaw } from '../../types/raw/rda-property';
import { DataState, readJSONFile } from './utils';
import { NAMES } from './utils/names';

export const reader = (dataState: DataState) => {
  const entities = {
    all: () => readJSONFile<EntitiesRaw>(NAMES.entity, dataState),
    single: (entityId: EntityId) => {
      const entity = readJSONFile<EntitiesRaw>(NAMES.entity, dataState);
      return entity[entityId];
      // entityId
    },
    index: () =>
      readJSONFile<EntitiesIndexRaw>(NAMES.entityIndex, DataState.raw),
  };

  const fields = () => readJSONFile<FieldsRaw>(NAMES.fields, dataState);

  const labels = {
    de: () => readJSONFile<LabelDeRaws>(NAMES.labelDe, dataState),
    en: () => readJSONFile<LabelEnRaws>(NAMES.labelEn, dataState),
  };

  const schemas = () => readJSONFile<SchemasRaw>(NAMES.schema, dataState);
  const staNotations = () =>
    readJSONFile<StaNotationsRaw>(NAMES.staNotation, dataState);
  const codings = () => readJSONFile<CodingRaw[]>(NAMES.coding, dataState);
  const descriptions = () =>
    readJSONFile<DescriptionRaws>(NAMES.description, dataState);
  const rdaRules = () => readJSONFile(NAMES.rdaRule, dataState);
  const rdaProperties = () =>
    readJSONFile<RdaPropertiesRaw>(NAMES.rdaProperty, dataState);

  return {
    entities,
    fields,
    labels,
    staNotations,
    schemas,
    codings,
    descriptions,
    rdaRules,
    rdaProperties,
  };
};
