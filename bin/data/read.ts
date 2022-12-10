import { EntityId } from '../../types/entity-id';
import { CodingRaw } from '../../types/raw/coding';
import { DescriptionRaw } from '../../types/raw/description';
import { EntitiesRaw } from '../../types/raw/entity';
import { EntityIndexRaw } from '../../types/raw/entity-index';
import { FieldsRaw } from '../../types/raw/field';
import { LabelDeRaws } from '../../types/raw/label-de';
import { LabelEnRaws } from '../../types/raw/label-en';
import { NotationRaw } from '../../types/raw/notation';
import { RdaPropertyRaw } from '../../types/raw/rda-property';
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
      readJSONFile<EntityIndexRaw[]>(NAMES.entityIndex, DataState.raw),
  };

  const fields = () => readJSONFile<FieldsRaw>(NAMES.fields, dataState);

  const labels = {
    de: () => readJSONFile<LabelDeRaws>(NAMES.labelDe, dataState),
    en: () => readJSONFile<LabelEnRaws>(NAMES.labelEn, dataState),
  };

  const notations = () =>
    readJSONFile<NotationRaw[]>(NAMES.notation, dataState);
  const codings = () => readJSONFile<CodingRaw[]>(NAMES.coding, dataState);
  const descriptions = () =>
    readJSONFile<DescriptionRaw[]>(NAMES.description, dataState);
  const rdaRules = () => readJSONFile(NAMES.rdaRule, dataState);
  const rdaProperties = () =>
    readJSONFile<RdaPropertyRaw[]>(NAMES.rdaProperty, dataState);

  return {
    entities,
    fields,
    labels,
    notations,
    codings,
    descriptions,
    rdaRules,
    rdaProperties,
  };
};
