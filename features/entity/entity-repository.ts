import entities from '@/data/parsed/entities-de.json';
import entitiesFr from '@/data/parsed/entities-fr.json';
import { EntitiesEntries, EntityEntry } from '@/types/parsed/entity';
import { EntityId } from '@/types/entity-id';
import { API_URL, fetcher } from '@/bin/data/fetcher';
import { EntitiesRaw } from '@/types/raw/entity';
import { prefetchEmbeddedEntities } from '@/bin/data/utils/embedded-entity-ids';
import parsedLabelsDe from '@/data/parsed/labels-de.json';
import { parseEntities, ParseEntitiesData } from '@/bin/data/parse/entities';
import parsedLabelsEn from '@/data/parsed/labels-en.json';
import parsedLabelsFr from '@/data/parsed/labels-fr.json';
import parsedCodings from '@/data/parsed/codings.json';
import parsedPropertyTypes from '@/data/parsed/property-types.json';
import parsedStaNotations from '@/data/parsed/sta-notations.json';
import parsedSchemas from '@/data/parsed/schemas.json';
import parsedFields from '@/data/parsed/fields.json';
import parsedRdaElementStatuses from '@/data/parsed/rda-element-statuses.json';
import { FetchingParam } from '@/hooks/fetch-query-params-provider';
import { isPropertyBlacklisted } from '@/utils/constants';
import { Namespace } from '@/types/namespace';
import { EntityIndex } from '@/types/parsed/entity-index';


class EntityRepository {
  
  constructor() {
  
  }

  getAll(language: string | undefined) : EntityEntry[] {
    if (!language) {
      language = "de";
    }
    return Object.values(this.getPreparsedEntitiesEntries(language));
  }

  getAllIds(language: string | undefined) : string[] {
    return Object.keys(this.getAll(language));
  }

  getByStaNotation(language: string | undefined, staNotationLabel: string) : EntityEntry | undefined {
    return this.getAll(language).find((entityEntry) => entityEntry.entity.staNotationLabel === staNotationLabel);
  }

  getAllStaNotations(language: string | undefined) : string[] {
    return this.getAll(language).filter(
      (entityEntry: EntityEntry) =>
        !isPropertyBlacklisted(entityEntry.entity.id) &&
        'staNotationLabel' in entityEntry.entity,
    ).map(entityEntry => entityEntry.entity.staNotationLabel);
  }

  getEntityIndexByNamespace = (language: string, namespace: Namespace): EntityIndex[] => {
    return Object.values(this.getAll(language) as unknown as Record<EntityId, EntityEntry>)
      .filter((entityValue) => entityValue.entity.namespace === namespace)
      .map((entityValue) => {
        const { entity } = entityValue;
        const { label, id, pageType, staNotationLabel } = entity;
        return {
          label: label as string,
          id,
          pageTypeLabel: pageType?.deLabel,
          staNotationLabel,
        };
      });
  };

  async get(entityId: EntityId, language: string, live: FetchingParam | undefined) : Promise<EntityEntry | undefined> {
    let ret;
    if (live) {
      ret = this.getLiveEntityEntry(language, fetcher(API_URL.live), entityId);
    } else {
      ret = this.getPreparsedEntitiesEntries(language)[entityId];
    }
    return ret;
  }

  getPreparsedEntitiesEntries(language: string): EntitiesEntries {
    if (language && language === 'fr') {
      return entitiesFr as EntitiesEntries;
    } else {
      return entities as EntitiesEntries;
    }
  }
  

  async getLiveEntityEntry(lang: string, fetch: ReturnType<typeof fetcher>, entityId: EntityId) {
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
      const labelsDe = parsedLabelsDe as unknown as ParseEntitiesData['labelsDe'];
      const labelsEn = parsedLabelsEn as unknown as ParseEntitiesData['labelsEn'];
      const labelsFr = parsedLabelsFr as unknown as ParseEntitiesData['labelsFr'];
      const codings = parsedCodings as unknown as ParseEntitiesData['codings'];
      const propertyTypes = parsedPropertyTypes as unknown as ParseEntitiesData['propertyTypes'];
      const staNotations = parsedStaNotations as unknown as ParseEntitiesData['staNotations'];
      const schemas = parsedSchemas as unknown as ParseEntitiesData['schemas'];
      const fields = parsedFields as unknown as ParseEntitiesData['fields'];
      const rdaElementStatuses = parsedRdaElementStatuses as unknown as ParseEntitiesData['rdaElementStatuses'];
  
      const parsedEntities = parseEntities({
        rawEntities: { [entityId]: entity },
        getRawEntityById: (id: EntityId) => prefetched[id],
        lang,
        data: {
          labelsEn,
          labelsDe,
          labelsFr,
          codings,
          propertyTypes,
          staNotations,
          schemas,
          fields,
          rdaElementStatuses,
        },
      });
  
      return parsedEntities[entityId];
    }
  }
}

export const entityRepository = new EntityRepository();

