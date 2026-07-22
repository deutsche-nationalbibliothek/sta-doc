import fs from 'fs';
import path from 'path';
import { EntitiesEntries, EntityEntry } from '@/types/parsed/entity';
import { EntityId } from '@/types/entity-id';
import { FetchingParam } from '@/hooks/fetch-query-params-provider';
import { API_URL, fetcher } from '@/bin/data/fetcher';
import { EntitiesRaw } from '@/types/raw/entity';
import { prefetchEmbeddedEntities } from '@/bin/data/utils/embedded-entity-ids';
import { parseEntities } from '@/bin/data/parse/entities';
import { isPropertyBlacklisted } from '@/utils/constants';
import { Namespace } from '@/types/namespace';
import { EntityIndex } from '@/types/parsed/entity-index';
import { parseSparqlData } from '@/bin/data/parse';
import { reader } from '@/bin/data/read';
import { DataState } from '@/bin/data/utils';
import {
  EntitySsgIndexEntry,
  EntitySsgIndexFile,
} from '@/types/parsed/entity-ssg-index';
import ssgIndexDe from '@/data/parsed/entities-ssg-index-de.json';
import ssgIndexFr from '@/data/parsed/entities-ssg-index-fr.json';

const entitiesCache: Partial<Record<'de' | 'fr', EntitiesEntries>> = {};

const resolveLang = (lang: string | undefined): 'de' | 'fr' =>
  lang === 'fr' ? 'fr' : 'de';

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

  async get(
    entityId: EntityId,
    locale: string,
    live: FetchingParam | undefined
  ): Promise<EntityEntry | undefined> {
    const lang = resolveLang(locale);
    if (live) {
      const apiUrl = API_URL[live];
      return await this.getLiveEntityEntry(lang, fetcher(apiUrl), entityId);
    }
    return this.getPreparsedEntitiesEntries(lang)[entityId];
  }

  getPreparsedEntitiesEntries(lang: string | undefined): EntitiesEntries {
    return loadEntitiesEntries(lang);
  }

  async getLiveEntityEntry(
    lang: string,
    fetch: ReturnType<typeof fetcher>,
    entityId: EntityId
  ) {
    const prefetched = {} as EntitiesRaw;
    // prefetch to parse without async
    await prefetchEmbeddedEntities({
      entityId,
      getRawEntityById: async (entityId: EntityId) => {
        if (entityId in prefetched) {
          return prefetched[entityId];
        } else {
          const fetchedEntity = await fetch.entities.single(entityId);
          const prefetchedEntity = fetchedEntity[entityId];
          if (prefetchedEntity) {
            prefetched[entityId] = prefetchedEntity;
            return fetchedEntity[entityId];
          }
        }
      },
    });

    const entity = prefetched[entityId];
    if (entity) {
      const data = parseSparqlData(reader[DataState.raw], lang);
      const parsedEntities = parseEntities({
        rawEntities: { [entityId]: entity },
        getRawEntityById: (id: EntityId) => prefetched[id],
        lang,
        data: data,
      });

      return parsedEntities[entityId];
    }
  }
}

export const entityRepository = new EntityRepository();
