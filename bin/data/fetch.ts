import { DEV } from '.';
import { EntityId } from '../../types/entity-id';
import { EntitiesRaw } from '../../types/raw/entity';
import { parser } from './parse';
import { reader } from './read';
import { DataState, sparql, writeJSONFileAndType } from './utils';
import { fetchWithSparql } from './utils/fetch';
import { NAMES } from './utils/names';
import { fetchWikibase } from './wikibase';

export enum API_URL {
  test = 'https://doku.wikibase.wiki',
  prod = 'https://sta.dnb.de',
}

export const fetcher = (apiUrl = API_URL.prod) => {
  const onFetch = fetchWithSparql(apiUrl);
  const { fetchEntity, fetchFields, sparqlQuery } = fetchWikibase(onFetch);

  const entities = {
    single: async (entityId: EntityId) => await fetchEntity(entityId),
    all: async () => {
      // fetch and write entity Index
      const entityIndexRaw = await sparqlQuery(sparql.ENTITY_INDEX(apiUrl)); // ????
      writeJSONFileAndType(entityIndexRaw, NAMES.entityIndex, DataState.raw);

      // reader raw or parsed?
      const parse = parser(reader(DataState.raw));
      const entitiesIndex = parse.entities.index();
      writeJSONFileAndType(entitiesIndex, NAMES.entityIndex, DataState.parsed);

      console.log({ entityIndex: entitiesIndex, entries: entitiesIndex });
      let entities = {} as EntitiesRaw;

      console.log(
        '\tFetching',
        Object.keys(entitiesIndex).length,
        'entities separately'
      );

      const entitiesIndexEntries = Object.entries(entitiesIndex);
      for (let i = 0; i < (DEV ? 12 : entitiesIndexEntries.length); i++) {
        const [entityId] = entitiesIndexEntries[i];
        console.log('\t\tFetching', entityId);
        entities = { ...entities, [entityId]: await fetchEntity(entityId) };
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
  const descriptions = async () => await sparqlQuery(sparql.DESCRIPTIONS(apiUrl));
  const rdaRules = async () => await sparqlQuery(sparql.RDARULES(apiUrl));
  const rdaProperties = async () => await sparqlQuery(sparql.RDAPROPERTIES(apiUrl));

  const fetchAll = async () => {
    console.log('Data fetching is starting');
    const data = {
      entities: { all: await entities.all() },
      fields: await fields(),
      labels: {
        de: await labels.de(),
        en: await labels.en(),
      },
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
  };
};
