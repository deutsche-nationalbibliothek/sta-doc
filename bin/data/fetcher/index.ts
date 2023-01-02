import { DEV } from '..';
import { EntityId } from '../../../types/entity-id';
import { EntitiesIndex } from '../../../types/parsed/entity-index';
import { CodingsRaw } from '../../../types/raw/coding';
import { DescriptionRaws } from '../../../types/raw/description';
import { EntityRaw } from '../../../types/raw/entity';
import { LabelDeRaws } from '../../../types/raw/label-de';
import { LabelEnRaws } from '../../../types/raw/label-en';
import { NotationsRaw } from '../../../types/raw/notation';
import { RdaPropertiesRaw } from '../../../types/raw/rda-property';
import { RdaRulesRaw } from '../../../types/raw/rda-rule';
import { sparql } from '../utils';
import { fetchWithSparql } from '../utils/fetch';
import { fetchWikibase } from '../wikibase';

export enum API_URL {
  test = 'https://doku.wikibase.wiki',
  prod = 'https://sta.dnb.de',
}

const wikiBase = (apiUrl: API_URL) => {
  const onFetch = fetchWithSparql(apiUrl);
  return fetchWikibase(onFetch);
};

export const entitiesFetcher = {
  single: async (entityId: EntityId, apiUrl: API_URL) =>
    await wikiBase(apiUrl).fetchEntity(entityId),
  all: async (apiUrl: API_URL) => {
    const entitiesIndex = await wikiBase(apiUrl).sparqlQuery<EntitiesIndex>(
      sparql.ENTITY_INDEX(apiUrl)
    );
    const entries = Object.entries(entitiesIndex);
    let entities = {} as EntityRaw;

    console.log(
      '\tFetching',
      Object.keys(entries).length,
      'entities separately'
    );

    for (let i = 0; i < (DEV ? 2 : entries.length); i++) {
      const [entryId] = entries[i];
      const fetchedEntity = await wikiBase(apiUrl).fetchEntity(entryId);
      entities = { ...entities, [entryId]: fetchedEntity };
    }
    return entities;
  },
};

export const fieldsFetcher = async (apiUrl: API_URL) => {
  return (await wikiBase(apiUrl).fetchFields()).fields;
};

export const labelsFetcher = {
  de: async (apiUrl: API_URL) =>
    await wikiBase(apiUrl).sparqlQuery<LabelDeRaws>(sparql.LABELDE(apiUrl)),
  en: async (apiUrl: API_URL) =>
    await wikiBase(apiUrl).sparqlQuery<LabelEnRaws>(sparql.LABELEN(apiUrl)),
};

export const notationsFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<NotationsRaw>(sparql.NOTATIONS(apiUrl));
export const codingsFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<CodingsRaw>(sparql.CODINGS(apiUrl));
export const descriptionsFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<DescriptionRaws>(
    sparql.DESCRIPTIONS(apiUrl)
  );
export const rdaRulesFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<RdaRulesRaw>(sparql.RDARULES(apiUrl));
export const rdaPropertiesFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<RdaPropertiesRaw>(
    sparql.RDAPROPERTIES(apiUrl)
  );

export const fetcher = (apiUrl = API_URL.prod) => {
  const entities = {
    single: async (entityId: EntityId) =>
      await entitiesFetcher.single(entityId, apiUrl),
    all: async () => await entitiesFetcher.all(apiUrl),
  };

  const fields = async () => await fieldsFetcher(apiUrl);

  const labels = {
    de: async () => await labelsFetcher.de(apiUrl),
    en: async () => await labelsFetcher.en(apiUrl),
  };

  const notations = async () => await notationsFetcher(apiUrl);
  const codings = async () => await codingsFetcher(apiUrl);
  const descriptions = async () => await descriptionsFetcher(apiUrl);
  const rdaRules = async () => await rdaRulesFetcher(apiUrl);
  const rdaProperties = async () => await rdaPropertiesFetcher(apiUrl);

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
    labels,
    notations,
    codings,
    fetchAll,
  };
};
