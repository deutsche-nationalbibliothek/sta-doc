import type { NextApiRequest, NextApiResponse } from 'next';
import { EntityId } from '@/types/entity-id';
import { EntitiesRaw } from '@/types/raw/entity';
import { EntitiesEntries } from '@/types/parsed/entity';
import entities from '@/data/parsed/entities.json';
import parsedCodings from '@/data/parsed/codings.json';
import parsedFields from '@/data/parsed/fields.json';
import parsedLabelsDe from '@/data/parsed/labels-de.json';
import parsedLabelsEn from '@/data/parsed/labels-en.json';
import parsedPropertyTypes from '@/data/parsed/property-types.json';
import parsedRdaElementStatuses from '@/data/parsed/rda-element-statuses.json';
import parsedSchemas from '@/data/parsed/schemas.json';
import parsedStaNotations from '@/data/parsed/sta-notations.json';
import { parseEntities, ParseEntitiesData } from '@/bin/data/parse/entities';
import { prefetchEmbeddedEntities } from '@/bin/data/utils/embedded-entity-ids';
import { FetchingParam } from '@/hooks/fetch-query-params-provider';
import { fetcher, API_URL } from '@/bin/data/fetcher';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const entityId = req.query.entityId as EntityId;
  const live = req.query.live as FetchingParam;

  if (typeof entityId === 'string') {
    if (live) {
      let entitiesEntries: EntitiesEntries | undefined;
      if (live === FetchingParam.prod) {
        entitiesEntries = await getLiveEntity(fetcher(API_URL.prod), entityId);
      } else if (live === FetchingParam.test) {
        entitiesEntries = await getLiveEntity(fetcher(API_URL.test), entityId);
      } else if (live === FetchingParam.live) {
        entitiesEntries = await getLiveEntity(fetcher(API_URL.live), entityId);
      }
      if (entitiesEntries) {
        res.status(200).json(entitiesEntries[entityId]);
      } else {
        console.error(
          'Live fetching did not work for entity-id',
          entityId,
          'with live query',
          live
        );
      }
      return;
    } else {
      res.status(200).json((entities as unknown as EntitiesEntries)[entityId]);
    }
  }
};

const getLiveEntity = async (
  fetch: ReturnType<typeof fetcher>,
  entityId: EntityId
) => {
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
    const labelsEn = parsedLabelsEn as unknown as ParseEntitiesData['labelsEn'];
    const labelsDe = parsedLabelsDe as unknown as ParseEntitiesData['labelsDe'];
    const codings = parsedCodings as unknown as ParseEntitiesData['codings'];
    const propertyTypes = parsedPropertyTypes as unknown as ParseEntitiesData['propertyTypes'];
    const staNotations = parsedStaNotations as unknown as ParseEntitiesData['staNotations'];
    const schemas = parsedSchemas as unknown as ParseEntitiesData['schemas'];
    const fields = parsedFields as unknown as ParseEntitiesData['fields'];
    const rdaElementStatuses = parsedRdaElementStatuses as unknown as ParseEntitiesData['rdaElementStatuses'];

    return parseEntities({
      rawEntities: { [entityId]: entity },
      getRawEntityById: (id: EntityId) => prefetched[id],
      data: {
        labelsEn,
        labelsDe,
        codings,
        propertyTypes,
        staNotations,
        schemas,
        fields,
        rdaElementStatuses,
      },
    });
  }
};
