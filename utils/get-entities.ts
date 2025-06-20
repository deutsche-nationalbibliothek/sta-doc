import entities from '@/data/parsed/entities.json';
import entities_fr from '@/data/parsed/entities-fr.json';
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
import type { NextApiRequest, NextApiResponse } from 'next';
import entitiesFr from '@/data/parsed/entities-fr.json';
import { isPropertyBlacklisted } from '@/utils/constants';

export function getPreparsedEntitiesEntries(language: string): EntitiesEntries {
  if (language && language === 'fr') {
    return entities_fr as EntitiesEntries;
  } else {
    return entities as EntitiesEntries;
  }
}

export async function getEntityEntry(language: string, entityId: EntityId, live: FetchingParam) {
  if (live) {
    let api_url: API_URL = API_URL.live;
    if (live === FetchingParam.prod) {
      api_url = API_URL.prod;
    } else if (live === FetchingParam.test) {
      api_url = API_URL.test;
    }
    return getLiveEntityEntry(language, fetcher(api_url), entityId);
  }
  return getPreparsedEntitiesEntries(language)[entityId];
}

export function getEntityEntryByStaNotation(language: string, staNotationLabel: string) {
  return Object.values(getPreparsedEntitiesEntries(language)).find((entityEntry) => entityEntry.entity.staNotationLabel === staNotationLabel);
}

async function getLiveEntityEntry(lang: string, fetch: ReturnType<typeof fetcher>, entityId: EntityId) {
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

export async function getEntityJson(language: string, req: NextApiRequest, res: NextApiResponse) {
  const entityId = req.query.entityId as EntityId;
  const live = req.query.live as FetchingParam;
  if (typeof entityId === 'string') {
    const entity = await getEntityEntry(language, entityId, live);
    res.status(200).json(entity);
  }
}

export function getAllStaNotations(language: string) {
  return Object.values(getPreparsedEntitiesEntries(language)).filter(
      (entityEntry: EntityEntry) =>
        !isPropertyBlacklisted(entityEntry.entity.id) &&
        'staNotationLabel' in entityEntry.entity,
    ).map(entityEntry => entityEntry.entity.staNotationLabel);
}

