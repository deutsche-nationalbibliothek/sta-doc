import { DEV } from '..';
import { EntityId } from '../../../types/entity-id';
import { CodingsRaw } from '../../../types/raw/coding';
import { DescriptionRaws } from '../../../types/raw/description';
import { EntityRaw } from '../../../types/raw/entity';
import { EntitiesIndexRaw } from '../../../types/raw/entity-index';
import { LabelDeRaws } from '../../../types/raw/label-de';
import { LabelEnRaws } from '../../../types/raw/label-en';
import { NotationsRaw } from '../../../types/raw/notation';
import { PropertiesItemsListRaw } from '../../../types/raw/property-item-list';
import { RdaPropertiesRaw } from '../../../types/raw/rda-property';
import { RdaRulesRaw } from '../../../types/raw/rda-rule';
import { StaNotationsRaw } from '../../../types/raw/sta-notation';
import { entitiesParser } from '../parse';
import { sparql } from '../utils';
import { fetchWithSparql } from '../utils/fetch';
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
      arr.splice(1, chunkSize)
    );
  };

  const chunkSize = 50;
  const chunked = chunk([...entitiesIndexKeys], chunkSize);
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

const wikiBase = (apiUrl: API_URL) => {
  const onFetch = fetchWithSparql(apiUrl);
  return fetchWikibase(onFetch);
};

export const entitiesFetcher = {
  single: async (entityId: EntityId, apiUrl: API_URL) =>
    await wikiBase(apiUrl).fetchEntity(entityId),
  all: async (apiUrl: API_URL) => {
    const entitiesIndexRaw = await wikiBase(
      apiUrl
    ).sparqlQuery<EntitiesIndexRaw>(sparql.ENTITY_INDEX(apiUrl));

    const entitiesIndex = entitiesParser.index(entitiesIndexRaw);
    let entities = {} as Record<EntityId, EntityRaw | void>;
    const entitiesChunked = entitiesChunk(
      Object.keys(entitiesIndex) as EntityId[]
    );

    for (let i = 0; i < (DEV ? 1 : entitiesChunked.length); i++) {
      const entityIds = entitiesChunked[i];
      const entitiesBulkFetched = await wikiBase(apiUrl).fetchEntity(entityIds);
      entities = { ...entities, ...entitiesBulkFetched };
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

export const staNotationsFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<StaNotationsRaw>(
    sparql.STA_NOTATIONS(apiUrl)
  );
export const notationsFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<NotationsRaw>(sparql.NOTATIONS(apiUrl));
export const elementsOfFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<NotationsRaw>(sparql.ELEMENTS_OF(apiUrl));
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
const propertyItemListFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<PropertiesItemsListRaw>(
    sparql.propertyItemList(apiUrl)
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

  const staNotations = async () => await staNotationsFetcher(apiUrl);
  const notations = async () => await notationsFetcher(apiUrl);
  const elementsOf = async () => await elementsOfFetcher(apiUrl);
  const codings = async () => await codingsFetcher(apiUrl);
  const descriptions = async () => await descriptionsFetcher(apiUrl);
  const rdaRules = async () => await rdaRulesFetcher(apiUrl);
  const rdaProperties = async () => await rdaPropertiesFetcher(apiUrl);
  const propertyItemList = async () => await propertyItemListFetcher(apiUrl);

  const fetchAll = async () => {
    console.log('Data fetching is starting');
    const data = {
      entities: { all: await entities.all() },
      fields: await fields(),
      labels: {
        de: await labels.de(),
        en: await labels.en(),
      },
      staNotations: await staNotations(),
      notations: await notations(),
      elementsOf: await elementsOf(),
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
    staNotations,
    notations,
    codings,
    fetchAll,
    propertyItemList,
  };
};
