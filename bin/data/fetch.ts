import { DEV } from '.';
import { EntityId } from '../../types/entity-id';
import { EntitiesRaw, EntityRaw } from '../../types/raw/entity';
import { PropertiesItemsListRaw } from '../../types/raw/property-item-list';
import { entitiesParser, parseAllFromRead } from './parse';
import { reader } from './read';
import { DataState, sparql, writeJSONFileAndType } from './utils';
import { fetchWithSparql } from './utils/fetch';
import { NAMES } from './utils/names';
import { fetchWikibase } from './wikibase';

export enum API_URL {
  test = 'https://doku.wikibase.wiki',
  prod = 'https://sta.dnb.de',
}

/**
 * @param entitiesIndexKeys - complete set of all relevant Entity Ids
 * @returns Array of strings, each contains a set of entityIds, seperated by '|'
 */
const entitiesChunk = (entitiesIndexKeys: EntityId[]) => {
  const chunk = (arr: string[], chunkSize: number) => {
    return Array.from({ length: Math.ceil(arr.length / chunkSize) }).map(() =>
      [...arr].splice(0, chunkSize)
    );
  };

  const chunkSize = 50;
  const chunked = chunk(entitiesIndexKeys, chunkSize);
  console.log(
    '\tFetching',
    entitiesIndexKeys.length,
    'Entities, in chunks, each in the size of',
    chunkSize,
    'requesting',
    chunked.length,
    'sets'
  );

  return chunked.map((bulk) => bulk.join('|'));
};

export const fetcher = (apiUrl = API_URL.prod) => {
  const onFetch = fetchWithSparql(apiUrl);
  const { fetchEntity, fetchFields, sparqlQuery } = fetchWikibase(onFetch);

  const entities = {
    single: async (entityId: EntityId) => await fetchEntity(entityId)[entityId],
    all: async () => {
      // fetch and write entity Index
      const entityIndexRaw = await sparqlQuery(sparql.ENTITY_INDEX(apiUrl)); // ????
      writeJSONFileAndType(entityIndexRaw, NAMES.entityIndex, DataState.raw);

      // reader raw or parsed?
      // const parse = entitiesParser.index(entityIndexRaw as any) // parseAllFromRead(reader(DataState.raw));
      const entitiesIndex = entitiesParser.index(entityIndexRaw as any);
      writeJSONFileAndType(entitiesIndex, NAMES.entityIndex, DataState.parsed);

      let entities = {} as Record<EntityId, EntityRaw | void>;
      const entitiesChunked = entitiesChunk(
        Object.keys(entitiesIndex) as EntityId[]
      );

      for (let i = 0; i < (DEV ? 1 : entitiesChunked.length); i++) {
        const entityIds = entitiesChunked[i];
        const entitiesBulkFetched = await fetchEntity(entityIds);
        entities = { ...entities, ...entitiesBulkFetched };
      }
      return entities;
    },
  };

  const fields = async () => {
    return (await fetchFields()).fields;
  };

  const labels = {
    de: async () => await sparqlQuery(sparql.LABELDE(apiUrl)),
    en: async () => await sparqlQuery(sparql.LABELEN(apiUrl)),
  };

  const notations = async () => await sparqlQuery(sparql.NOTATIONS(apiUrl));
  const codings = async () => await sparqlQuery(sparql.CODINGS(apiUrl));
  const descriptions = async () =>
    await sparqlQuery(sparql.DESCRIPTIONS(apiUrl));
  const rdaRules = async () => await sparqlQuery(sparql.RDARULES(apiUrl));
  const rdaProperties = async () =>
    await sparqlQuery(sparql.RDAPROPERTIES(apiUrl));
  const propertyItemList = async () =>
    await sparqlQuery<PropertiesItemsListRaw>(sparql.propertyItemList(apiUrl));

  // no propertyItemList as a single exception, it's exported
  const fetchAll = async () => {
    console.log('Data fetching is starting');
    const data = {
      labels: {
        de: await labels.de(),
        en: await labels.en(),
      },
      entities: { all: await entities.all() },
      fields: await fields(),
      notations: await notations(),
      codings: await codings(),
      descriptions: await descriptions(),
      rdaRules: await rdaRules(),
      rdaProperties: await rdaProperties(),
    };
    console.log('Data fetching has finished');
    return data;
  };

  return {
    entities,
    fields,
    fetchAll,
    propertyItemList,
  };
};
