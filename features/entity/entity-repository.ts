import entities from '@/data/parsed/entities-de.json';
import entitiesFr from '@/data/parsed/entities-fr.json';
import { EntitiesEntries, EntityEntry } from '@/types/parsed/entity';
import { EntityId } from '@/types/entity-id';
import { FetchingParam } from '@/hooks/fetch-query-params-provider';
import { API_URL, fetcher } from '@/bin/data/fetcher';
import { EntitiesRaw } from '@/types/raw/entity';
import { prefetchEmbeddedEntities } from '@/bin/data/utils/embedded-entity-ids';
import parsedLabelsDe from '@/data/parsed/labels-de.json';
import { parseEntities, ParseEntitiesData } from '@/bin/data/parse/entities';
import parsedLabelsEn from '@/data/parsed/labels-en.json';
import parsedLabelsFr from '@/data/parsed/labels-fr.json';
import parsedBreadcrumbs from '@/data/parsed/breadcrumbs.json';
import parsedCodings from '@/data/parsed/codings.json';
import parsedPropertyTypes from '@/data/parsed/property-types.json';
import parsedStaNotations from '@/data/parsed/sta-notations.json';
import parsedSchemas from '@/data/parsed/schemas.json';
import parsedFields from '@/data/parsed/fields.json';
import parsedRdaElementStatuses from '@/data/parsed/rda-element-statuses.json';
import { isPropertyBlacklisted } from '@/utils/constants';
import { Namespace } from '@/types/namespace';
import { EntityIndex } from '@/types/parsed/entity-index';
import { parseSparqlData } from '@/bin/data/parse';
import { reader } from '@/bin/data/read';
import { DataState } from '@/bin/data/utils';


class EntityRepository {
  getAll(lang: string | undefined) : EntityEntry[] {
    if (!lang) {
      lang = "de";
    }
    return Object.values(this.getPreparsedEntitiesEntries(lang));
  }

  getAllIds(lang: string | undefined) : string[] {
    return Object.keys(this.getAll(lang));
  }

  getByStaNotation(lang: string | undefined, staNotationLabel: string) : EntityEntry | undefined {
    return this.getAll(lang).find((entityEntry) => entityEntry.entity.staNotationLabel === staNotationLabel);
  }

  getAllStaNotations(lang: string | undefined) : string[] {
    return this.getAll(lang).filter(
      (entityEntry: EntityEntry) =>
        !isPropertyBlacklisted(entityEntry.entity.id) &&
        'staNotationLabel' in entityEntry.entity,
    ).map(entityEntry => entityEntry.entity.staNotationLabel);
  }

  getEntityIndexByNamespace = (lang: string, namespace: Namespace): EntityIndex[] => {
    return Object.values(this.getAll(lang) as unknown as Record<EntityId, EntityEntry>)
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

  async get(entityId: EntityId, locale: string, live: FetchingParam | undefined) : Promise<EntityEntry | undefined> {
    let lang = locale as unknown as string
    if (!lang) { lang = "de"}
    let ret;
    if (live) {
      const apiUrl = API_URL[live]
      ret = await this.getLiveEntityEntry(lang, fetcher(apiUrl), entityId);
    } else {
      ret = this.getPreparsedEntitiesEntries(lang)[entityId];
    }
    return ret;
  }

  getPreparsedEntitiesEntries(lang: string): EntitiesEntries {
    if (lang && lang === 'fr') {
      return entitiesFr as unknown as EntitiesEntries;
    } else {
      return entities as unknown as EntitiesEntries;
    }
  }
  

  async getLiveEntityEntry(lang: string, fetch: ReturnType<typeof fetcher>, entityId: EntityId ) {
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
      const data = parseSparqlData(reader[DataState.raw],lang);
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

