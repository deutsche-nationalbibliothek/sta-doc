import { StaNotationsRaw } from '../../types/raw/sta-notation';
import { EntityId } from '../../types/entity-id';
import { SchemasRaw } from '../../types/raw/schema';
import { CodingsRaw } from '../../types/raw/coding';
import { DescriptionRaws } from '../../types/raw/description';
import { EntitiesRaw, EntityRaw } from '../../types/raw/entity';
import { EntitiesIndexRaw } from '../../types/raw/entity-index';
import { FieldsRaw } from '../../types/raw/field';
import { LabelDeRaws } from '../../types/raw/label-de';
import { LabelEnRaws } from '../../types/raw/label-en';
import { LabelFrRaws } from '../../types/raw/label-fr';
import { RdaPropertiesRaw } from '../../types/raw/rda-property';
import { DataState, readJSONFile } from './utils';
import { NAMES } from './utils/names';
import { RdaProperties } from '../../types/parsed/rda-property';
import { LabelsDe } from '../../types/parsed/label-de';
import { LabelsEn } from '../../types/parsed/label-en';
import { LabelsFr } from '../../types/parsed/label-fr';
import {
  Codings,
  EntitiesEntries,
  EntityEntry,
} from '../../types/parsed/entity';
import { EntitiesIndex } from '../../types/parsed/entity-index';
import { Fields } from '../../types/parsed/field';
import { Schemas } from '../../types/parsed/schema';
import { StaNotations } from '../../types/parsed/sta-notation';
import { Descriptions } from '../../types/parsed/description';
import { RdaElementStatusesRaw } from '../../types/raw/rda-element-status';
import { RdaElementStatuses } from '../../types/parsed/rda-element-status';
import { PropertyTypesRaw } from '../../types/raw/property-type';

interface ReadParsed {
  labels: {
    de: () => LabelsDe;
    en: () => LabelsEn;
    fr: () => LabelsFr;
  };
  entities: {
    all: (lang: string) => EntitiesEntries;
    single: (entityId: EntityId) => EntityEntry;
    index: () => EntitiesIndex;
  };
  fields: () => Fields;
  schemas: () => Schemas;
  staNotations: () => StaNotations;
  codings: () => Codings;
  descriptions: () => Descriptions;
  rdaProperties: () => RdaProperties;
  rdaElementStatuses: () => RdaElementStatuses;
}

export interface ReadRaw {
  labels: {
    de: () => LabelDeRaws;
    en: () => LabelEnRaws;
    fr: () => LabelFrRaws;
  };
  entities: {
    all: () => EntitiesRaw;
    single: (entityId: EntityId) => EntityRaw;
    index: () => EntitiesIndexRaw;
  };
  fields: () => FieldsRaw;
  propertyTypes: () => PropertyTypesRaw;
  schemas: () => SchemasRaw;
  staNotations: (lang: string) => StaNotationsRaw;
  codings: () => CodingsRaw;
  descriptions: () => DescriptionRaws;
  rdaProperties: () => RdaPropertiesRaw;
  rdaElementStatuses: () => RdaElementStatusesRaw;
}

const readRaw: ReadRaw = {
  entities: {
    all: () => readJSONFile<EntitiesRaw>(NAMES.entity, DataState.raw),
    single: (entityId: EntityId) => {
      const entity = readJSONFile<EntitiesRaw>(NAMES.entity, DataState.raw);
      return entity[entityId];
      // entityId
    },
    index: () =>
      readJSONFile<EntitiesIndexRaw>(NAMES.entityIndex, DataState.raw),
  },
  fields: () => readJSONFile<FieldsRaw>(NAMES.fields, DataState.raw),
  labels: {
    de: () => readJSONFile<LabelDeRaws>(NAMES.labelDe, DataState.raw),
    en: () => readJSONFile<LabelEnRaws>(NAMES.labelEn, DataState.raw),
    fr: () => readJSONFile<LabelFrRaws>(NAMES.labelFr, DataState.raw),
  },
  propertyTypes: () => readJSONFile<PropertyTypesRaw>(NAMES.propertyType, DataState.raw),
  staNotations: (lang) => {
    if (lang === 'fr') {
      return readJSONFile<StaNotationsRaw>(NAMES.staNotationFr, DataState.raw)
    } else {
      return readJSONFile<StaNotationsRaw>(NAMES.staNotation, DataState.raw)
    }
  },
  // staNotationsFr: () =>
  //   readJSONFile<StaNotationsRaw>(NAMES.staNotationFr, DataState.raw),
  schemas: () => readJSONFile<SchemasRaw>(NAMES.schema, DataState.raw),
  codings: () => readJSONFile<CodingsRaw>(NAMES.coding, DataState.raw),
  descriptions: () =>
    readJSONFile<DescriptionRaws>(NAMES.description, DataState.raw),
  rdaProperties: () =>
    readJSONFile<RdaPropertiesRaw>(NAMES.rdaProperty, DataState.raw),
  rdaElementStatuses: () =>
    readJSONFile<RdaElementStatusesRaw>(
      NAMES.rdaElementStatuses,
      DataState.raw
    ),
  // rdaRules: () => readJSONFile(NAMES.rdaRule, dataState),
};

const readParsed: ReadParsed = {
  entities: {
    all: (lang: string) => {
      if ( lang == 'fr') {
        return readJSONFile<EntitiesEntries>(NAMES.entityFr, DataState.parsed);
      } else {
        return readJSONFile<EntitiesEntries>(NAMES.entityDe, DataState.parsed);
      }
    },
    single: (entityId: EntityId) => {
      const entity = readJSONFile<EntitiesEntries>(
        NAMES.entity,
        DataState.parsed
      );
      return entity[entityId];
      // entityId
    },
    index: () =>
      readJSONFile<EntitiesIndex>(NAMES.entityIndex, DataState.parsed),
  },
  fields: () => readJSONFile<Fields>(NAMES.fields, DataState.parsed),
  labels: {
    de: () => readJSONFile<LabelsDe>(NAMES.labelDe, DataState.parsed),
    en: () => readJSONFile<LabelsEn>(NAMES.labelEn, DataState.parsed),
    fr: () => readJSONFile<LabelsFr>(NAMES.labelFr, DataState.parsed),
  },
  staNotations: () =>
    readJSONFile<StaNotations>(NAMES.staNotation, DataState.parsed),
  schemas: () => readJSONFile<Schemas>(NAMES.schema, DataState.parsed),
  codings: () => readJSONFile<Codings>(NAMES.coding, DataState.parsed),
  descriptions: () =>
    readJSONFile<Descriptions>(NAMES.description, DataState.parsed),
  rdaProperties: () =>
    readJSONFile<RdaProperties>(NAMES.rdaProperty, DataState.parsed),
  rdaElementStatuses: () =>
    readJSONFile<RdaElementStatuses>(
      NAMES.rdaElementStatuses,
      DataState.parsed
    ),
  // rdaRules: () => readJSONFile(NAMES.rdaRule, dataState),
};

interface Reader {
  [DataState.raw]: ReadRaw;
  [DataState.parsed]: ReadParsed;
}

export const reader: Reader = {
  raw: readRaw,
  parsed: readParsed,
};
