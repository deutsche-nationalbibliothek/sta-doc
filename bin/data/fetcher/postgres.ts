import fs from 'fs';
import path from 'path';
import { EntityId } from '../../../types/entity-id';
import { EntitiesRaw } from '../../../types/raw/entity';
import { EntitiesIndexRaw } from '../../../types/raw/entity-index';
import { API_URL } from './index';

/**
 * Compatibility fetch from a Postgres→sta-doc export directory
 * (written by ExportPostgresToStaDocApp / PostgresStaDocCompatibilityExporter).
 *
 * Env:
 *   DATA_SOURCE=postgres
 *   STA_DOC_POSTGRES_EXPORT_DIR=path/to/export (default: data/raw)
 */
const exportDir = () =>
  process.env.STA_DOC_POSTGRES_EXPORT_DIR ||
  path.join(process.cwd(), 'data', 'raw');

const readJson = <T>(fileName: string, fallback: T): T => {
  const filePath = path.join(exportDir(), fileName);
  if (!fs.existsSync(filePath)) {
    console.warn('Postgres export file missing, using fallback:', filePath);
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
};

export const postgresFetcher = (_apiUrl: API_URL = API_URL.host) => {
  console.log('DATA_SOURCE=postgres – reading export from', exportDir());

  const entities = {
    single: async (entityId: EntityId) => {
      const all = readJson<EntitiesRaw>('entities.json', {} as EntitiesRaw);
      const entity = all[entityId];
      return entity ? { [entityId]: entity } : {};
    },
    all: async () => readJson<EntitiesRaw>('entities.json', {} as EntitiesRaw),
    index: async () =>
      readJson<EntitiesIndexRaw>('entities-index.json', [] as EntitiesIndexRaw),
  };

  const emptyArray = async () => [];

  const fetchAll = async () => {
    console.log('Postgres compatibility fetch starting');
    const data = {
      breadcrumbs: readJson('breadcrumbs.json', []),
      entities: { all: await entities.all(), index: await entities.index() },
      fields: readJson('fields.json', []),
      labels: {
        de: readJson('labels-de.json', []),
        en: readJson('labels-en.json', []),
        fr: readJson('labels-fr.json', []),
      },
      propertyTypes: readJson('property-types.json', []),
      staNotations: readJson('sta-notations.json', []),
      staNotationsFr: readJson('sta-notations-fr.json', []),
      schemas: readJson('schemas.json', []),
      codings: readJson('codings.json', []),
      descriptions: readJson('descriptions.json', []),
      rdaRules: [],
      rdaProperties: readJson('rda-properties.json', []),
      rdaElementStatuses: readJson('rda-element-statuses.json', []),
    };
    console.log('Postgres compatibility fetch finished');
    return data;
  };

  return {
    entities,
    fields: emptyArray,
    labels: {
      de: async () => readJson('labels-de.json', []),
      en: async () => readJson('labels-en.json', []),
      fr: async () => readJson('labels-fr.json', []),
    },
    breadcrumbs: emptyArray,
    propertyTypes: emptyArray,
    staNotations: async () => readJson('sta-notations.json', []),
    staNotationsFr: async () => readJson('sta-notations-fr.json', []),
    schemas: async () => readJson('schemas.json', []),
    codings: emptyArray,
    descriptions: emptyArray,
    rdaRules: emptyArray,
    rdaProperties: emptyArray,
    propertyItemList: emptyArray,
    rdaElementStatuses: emptyArray,
    fetchAll,
  };
};
