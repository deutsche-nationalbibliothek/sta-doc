import type { NextApiRequest, NextApiResponse } from 'next';
import entities from '@/data/parsed/entities.json';
import { EntitiesEntries } from '@/types/parsed/entity';
// import { fetcher, API_URL } from '@/bin/data/fetcher';
import { EntityId } from '@/types/entity-id';
import { parseEntities } from '@/bin/data/parse/entities';
import {
  codingsParser,
  fieldsParser,
  labelsParser,
  rdaElementStatusesParser,
  schemasParser,
  staNotationsParser,
} from '@/bin/data/parse';
import { prefetchEmbeddedEntities } from '@/bin/data/utils/embedded-entity-ids';
import { FetchingParam } from '@/hooks/fetch-query-params-provider';
import { EntitiesRaw } from '@/types/raw/entity';
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
    }
    res.status(200).json((entities as unknown as EntitiesEntries)[entityId]);
  }
  res.status(404);
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
    const labelsEn = labelsParser.en(await fetch.labels.en());
    const labelsDe = labelsParser.de(await fetch.labels.de());
    const codings = codingsParser(await fetch.codings());
    const staNotations = staNotationsParser(await fetch.staNotations());
    const schemas = schemasParser(await fetch.schemas());
    const fields = fieldsParser(await fetch.fields(), staNotations);
    const rdaElementStatuses = rdaElementStatusesParser(
      await fetch.rdaElementStatuses(),
      staNotations,
      schemas
    );

    return parseEntities({
      rawEntities: { [entityId]: entity },
      getRawEntityById: (id: EntityId) => prefetched[id],
      data: {
        labelsEn,
        labelsDe,
        codings,
        staNotations,
        schemas,
        fields,
        rdaElementStatuses,
      },
    });
  }
};
