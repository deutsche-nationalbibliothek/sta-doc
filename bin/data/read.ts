import { LabelDeRaw } from './types/raw/label-de';
import { LabelEnRaw } from './types/raw/label-en';
import { NotationRaw } from './types/raw/notation';
import { CodingRaw } from './types/raw/coding';
import { EntityRaw } from './types/raw/entity';
import { EntityIndexRaw } from './types/raw/entity-index';
import { DescriptionRaw } from './types/raw/description';
import { RdaRuleRaw } from './types/raw/rda-rule';
import { RdaPropertyRaw } from './types/raw/rda-property';
import { DataState, readJSONFile } from './utils';
import { NAMES } from './utils/names';
import { FieldRaw } from './types/raw/field';

export const readRawData = () => {
  return readJSONFile<EntityRaw>(NAMES.entity, DataState.raw);
};

export const readEntityIndex = () => {
  return readJSONFile<EntityIndexRaw[]>(NAMES.entityIndex, DataState.raw);
};

export const readLabelDe = () => {
  return readJSONFile<LabelDeRaw[]>(NAMES.labelDe, DataState.raw);
};

export const readLabelEn = () => {
  return readJSONFile<LabelEnRaw[]>(NAMES.labelEn, DataState.raw);
};
export const readCodings = () => {
  return readJSONFile<CodingRaw[]>(NAMES.coding, DataState.raw);
};

export const readNotations = () => {
  return readJSONFile<NotationRaw[]>(NAMES.notation, DataState.raw);
};

export const readDescriptions = () => {
  return readJSONFile<DescriptionRaw[]>(NAMES.description, DataState.raw);
};

export const readRdaRules = (): RdaRuleRaw => {
  return readJSONFile<RdaRuleRaw>(NAMES.rdaRule, DataState.raw);
};

export const readRdaProperty = () => {
  return readJSONFile<RdaPropertyRaw[]>(NAMES.rdaProperty, DataState.raw);
};

export const readFields = () => {
  return readJSONFile<FieldRaw>(NAMES.fields, DataState.raw);
};
