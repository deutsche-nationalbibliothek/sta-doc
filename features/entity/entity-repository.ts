import fs from 'fs';
import path from 'path';
import { EntitiesEntries, EntityEntry } from '@/types/parsed/entity';
import { EntityId } from '@/types/entity-id';
import { FetchingParam } from '@/hooks/fetch-query-params-provider';
import { API_URL, fetcher } from '@/bin/data/fetcher';
import { EntitiesRaw } from '@/types/raw/entity';
import { prefetchEmbeddedEntities } from '@/bin/data/utils/embedded-entity-ids';
import { parseEntities, ParseEntitiesData } from '@/bin/data/parse/entities';
import { parseEntitiesDataFromRaw } from '@/bin/data/parse';
import { isPropertyBlacklisted } from '@/utils/constants';
import { Namespace } from '@/types/namespace';
import { EntityIndex } from '@/types/parsed/entity-index';
import {
  EntitySsgIndexEntry,
  EntitySsgIndexFile,
} from '@/types/parsed/entity-ssg-index';
import ssgIndexDe from '@/data/parsed/entities-ssg-index-de.json';
import ssgIndexFr from '@/data/parsed/entities-ssg-index-fr.json';

const entitiesCache: Partial<Record<'de' | 'fr', EntitiesEntries>> = {};
const liveLookupRawCache: Partial<
  Record<API_URL, Awaited<ReturnType<ReturnType<typeof fetcher>['lookupRaw']>>>
> = {};
const liveParsedDataCache: Partial<Record<string, ParseEntitiesData>> = {};

const resolveLang = (lang: string | undefined): 'de' | 'fr' =>
  lang === 'fr' ? 'fr' : 'de';

const resolveLiveApiUrl = (live: FetchingParam): API_URL | undefined => {
  switch (live) {
    case FetchingParam.live:
      return API_URL.live;
    case FetchingParam.prod:
      return API_URL.prod;
    case FetchingParam.test:
      return API_URL.test;
    default:
      return undefined;
  }
};

const loadLiveEntitiesData = async (
  lang: string,
  fetch: ReturnType<typeof fetcher>,
  apiUrl: API_URL
): Promise<ParseEntitiesData> => {
  const resolvedLang = resolveLang(lang);
  const cacheKey = `${apiUrl}:${resolvedLang}`;
  if (!liveParsedDataCache[cacheKey]) {
    if (!liveLookupRawCache[apiUrl]) {
      console.log('Fetching live lookup data from', apiUrl);
      liveLookupRawCache[apiUrl] = await fetch.lookupRaw();
    }
    const raw = liveLookupRawCache[apiUrl];
    if (!raw) {
      throw new Error(`Failed to load live lookup data from ${apiUrl}`);
    }
    liveParsedDataCache[cacheKey] = parseEntitiesDataFromRaw(
      {
        breadcrumbs: raw.breadcrumbs,
        codings: raw.codings,
        fields: raw.fields,
        labelsDe: raw.labelsDe,
        labelsEn: raw.labelsEn,
        labelsFr: raw.labelsFr,
        propertyTypes: raw.propertyTypes,
        rdaElementStatuses: raw.rdaElementStatuses,
        staNotations:
          resolvedLang === 'fr' ? raw.staNotationsFr : raw.staNotationsDe,
        staNotationsDe: raw.staNotationsDe,
        schemas: raw.schemas,
      },
      resolvedLang
    );
  }
  return liveParsedDataCache[cacheKey] as ParseEntitiesData;
};

const loadEntitiesEntries = (lang: string | undefined): EntitiesEntries => {
  const key = resolveLang(lang);
  if (!entitiesCache[key]) {
    const filePath = path.join(
      process.cwd(),
      'data/parsed',
      `entities-${key}.json`
    );
    entitiesCache[key] = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    ) as EntitiesEntries;
  }
  return entitiesCache[key] as EntitiesEntries;
};

const toEntityEntry = (entry: EntitySsgIndexEntry): EntityEntry =>
  ({
    headlines: entry.headlines,
    entity: {
      id: entry.id,
      label: entry.label,
      elementOf: entry.elementOf,
      namespace: entry.namespace,
      staNotationLabel: entry.staNotationLabel,
    },
  }) as EntityEntry;

class EntityRepository {
  getSsgIndex(lang: string | undefined): EntitySsgIndexFile {
    return (
      resolveLang(lang) === 'fr' ? ssgIndexFr : ssgIndexDe
    ) as EntitySsgIndexFile;
  }

  getAll(lang: string | undefined): EntityEntry[] {
    return Object.values(this.getPreparsedEntitiesEntries(lang));
  }

  getAllIds(lang: string | undefined): string[] {
    return Object.keys(this.getPreparsedEntitiesEntries(lang));
  }

  getByStaNotation(
    lang: string | undefined,
    staNotationLabel: string
  ): EntityEntry | undefined {
    const entry = this.getSsgIndex(lang).byStaNotation[staNotationLabel];
    if (!entry) {
      return undefined;
    }
    return toEntityEntry(entry);
  }

  getByIdFromSsgIndex(
    lang: string | undefined,
    entityId: EntityId
  ): EntityEntry | undefined {
    const entry = this.getSsgIndex(lang).byId[entityId];
    if (!entry) {
      return undefined;
    }
    return toEntityEntry(entry);
  }

  getAllStaNotations(lang: string | undefined): string[] {
    return Object.entries(this.getSsgIndex(lang).byStaNotation)
      .filter(([, entry]) => !isPropertyBlacklisted(entry.id))
      .map(([staNotationLabel]) => staNotationLabel);
  }

  getEntityIndexByNamespace = (
    lang: string,
    namespace: Namespace
  ): EntityIndex[] => {
    return Object.values(this.getPreparsedEntitiesEntries(lang))
      .filter((entityValue) => entityValue.entity.namespace === namespace)
      .map((entityValue) => {
        const { entity } = entityValue;
        const { label, id, pageType, staNotationLabel } = entity;
        return {
          label: label as string,
          id,
          pageTypeLabel: lang === 'fr' ? pageType?.labelFr : pageType?.labelDe,
          staNotationLabel,
        };
      });
  };

  resolveEntityId(entityId: string, lang: string | undefined): EntityId {
    const resolvedLang = resolveLang(lang);
    const id = entityId as EntityId;
    const preparsed = this.getPreparsedEntitiesEntries(resolvedLang);
    if (preparsed[id]) {
      return id;
    }
    const mappedId = this.getSsgIndex(resolvedLang).byStaNotation[entityId]?.id;
    if (mappedId && preparsed[mappedId]) {
      return mappedId;
    }
    return id;
  }

  async get(
    entityId: EntityId,
    locale: string,
    live: FetchingParam | undefined
  ): Promise<EntityEntry | undefined> {
    const lang = resolveLang(locale);
    const resolvedId = this.resolveEntityId(entityId, lang);
    if (live) {
      const apiUrl = resolveLiveApiUrl(live);
      if (!apiUrl) {
        throw new Error(`Unknown live source: ${live}`);
      }
      console.log('Fetching live entity', resolvedId, 'from', apiUrl);
      return await this.getLiveEntityEntry(
        lang,
        fetcher(apiUrl),
        resolvedId,
        apiUrl
      );
    }
    return this.getPreparsedEntitiesEntries(lang)[resolvedId];
  }

  getPreparsedEntitiesEntries(lang: string | undefined): EntitiesEntries {
    return loadEntitiesEntries(lang);
  }

  async getLiveEntityEntry(
    lang: string,
    fetch: ReturnType<typeof fetcher>,
    entityId: EntityId,
    apiUrl: API_URL
  ) {
    const prefetched = {} as EntitiesRaw;
    // prefetch to parse without async
    await prefetchEmbeddedEntities({
      entityId,
      getRawEntityById: async (entityId: EntityId) => {
        if (entityId in prefetched) {
          return prefetched[entityId];
        }
        try {
          const fetchedEntity = await fetch.entities.single(entityId);
          const prefetchedEntity = fetchedEntity[entityId];
          if (prefetchedEntity) {
            prefetched[entityId] = prefetchedEntity;
            return fetchedEntity[entityId];
          }
        } catch (error) {
          console.error('Failed to prefetch live entity', entityId, error);
        }
      },
    });

    const entity = prefetched[entityId];
    if (entity) {
      const parsedEntities = parseEntities({
        rawEntities: { [entityId]: entity },
        getRawEntityById: (id: EntityId) => prefetched[id],
        lang,
        data: await loadLiveEntitiesData(lang, fetch, apiUrl),
      });

      return parsedEntities[entityId];
    }
  }
}

export const entityRepository = new EntityRepository();
