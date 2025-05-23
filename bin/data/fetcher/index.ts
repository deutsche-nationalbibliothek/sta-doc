import { DEV } from '..';
import { EntityId } from '../../../types/entity-id';
import { CodingsRaw } from '../../../types/raw/coding';
import { SchemasRaw } from '../../../types/raw/schema';
import { DescriptionRaws } from '../../../types/raw/description';
import { EntitiesRaw, EntityRaw } from '../../../types/raw/entity';
import { EntitiesIndexRaw } from '../../../types/raw/entity-index';
import { LabelDeRaws } from '../../../types/raw/label-de';
import { LabelEnRaws } from '../../../types/raw/label-en';
import { PropertiesItemsListRaw } from '../../../types/raw/property-item-list';
import { RdaPropertiesRaw } from '../../../types/raw/rda-property';
import { RdaRulesRaw } from '../../../types/raw/rda-rule';
import { StaNotationsRaw } from '../../../types/raw/sta-notation';
import { entitiesParser } from '../parse';
import { sparql } from '../utils';
import { fetchWithSparql } from '../utils/fetch';
import { fetchWikibase } from './wikibase';
import { RdaElementStatusesRaw } from '../../../types/raw/rda-element-status';
import { PropertyTypesRaw } from '../../../types/raw/property-type';

export enum API_URL {
  host = 'https://edit.sta.dnb.de',
  test = 'http://lab.sta.dnb.de',
  prod = 'https://edit.sta.dnb.de',
  live = 'https://sta.dnb.de',
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

const fetchIndex = async (apiUrl: API_URL) => {
  return await wikiBase(apiUrl).sparqlQuery<EntitiesIndexRaw>(
    sparql.ENTITY_INDEX(apiUrl)
  );
};

export const entitiesFetcher = {
  index: fetchIndex,
  single: async (entityId: EntityId, apiUrl: API_URL) =>
    await wikiBase(apiUrl).fetchEntity(entityId),
  all: async (apiUrl: API_URL) => {
    const entitiesIndexRaw = await fetchIndex(apiUrl);
    const entitiesIndex = entitiesParser.index(entitiesIndexRaw);
    const entitiesChunked = entitiesChunk(
      Object.keys(entitiesIndex) as EntityId[]
    );

    let entities = {} as Record<EntityId, EntityRaw | void>;
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
export const schemasFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<SchemasRaw>(sparql.SCHEMAS(apiUrl));
export const codingsFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<CodingsRaw>(sparql.CODINGS(apiUrl));
export const descriptionsFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<DescriptionRaws>(
    sparql.DESCRIPTIONS(apiUrl)
  );
export const propertyTypesFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<PropertyTypesRaw>(
    sparql.PROPERTYTYPES(apiUrl)
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
const rdaElementStatusesFetcher = async (apiUrl: API_URL) =>
  await wikiBase(apiUrl).sparqlQuery<RdaElementStatusesRaw>(
    sparql.RDA_ELEMENT_STATUSES(apiUrl)
  );

export const fetcher = (apiUrl = API_URL.host) => {
  const entities = {
    single: async (entityId: EntityId) =>
      await entitiesFetcher.single(entityId, apiUrl),
    all: async () => await entitiesFetcher.all(apiUrl),
    index: async () => await entitiesFetcher.index(apiUrl),
  };

  const fields = async () => await fieldsFetcher(apiUrl);

  const labels = {
    de: async () => await labelsFetcher.de(apiUrl),
    en: async () => await labelsFetcher.en(apiUrl),
  };

  const propertyTypes = async () => await propertyTypesFetcher(apiUrl);
  const staNotations = async () => await staNotationsFetcher(apiUrl);
  const schemas = async () => await schemasFetcher(apiUrl);
  const codings = async () => await codingsFetcher(apiUrl);
  const descriptions = async () => await descriptionsFetcher(apiUrl);
  const rdaRules = async () => await rdaRulesFetcher(apiUrl);
  const rdaProperties = async () => await rdaPropertiesFetcher(apiUrl);
  const propertyItemList = async () => await propertyItemListFetcher(apiUrl);
  const rdaElementStatuses = async () =>
    await rdaElementStatusesFetcher(apiUrl);

  const fetchAll = async () => {
    console.log('Data fetching is starting');
    const data = {
      entities: { all: await entities.all(), index: await entities.index() },
      fields: await fields(),
      labels: {
        de: await labels.de(),
        en: await labels.en(),
      },
      propertyTypes: await propertyTypes(),
      staNotations: await staNotations(),
      schemas: await schemas(),
      codings: await codings(),
      descriptions: await descriptions(),
      rdaRules: await rdaRules(),
      rdaProperties: await rdaProperties(),
      rdaElementStatuses: await rdaElementStatuses(),
    };
    console.log('Data fetching has finished');
    return data;
  };

  return {
    entities,
    fields,
    labels,
    staNotations,
    codings,
    fetchAll,
    propertyItemList,
    propertyTypes,
    rdaElementStatuses,
    schemas,
  };
};

export interface ReadRawEntities {
  entities: {
    all: EntitiesRaw;
  };
}
