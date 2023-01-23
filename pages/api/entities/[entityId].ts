import type { NextApiRequest, NextApiResponse } from 'next';
import entities from '@/data/parsed/entities.json';
import { Entities, EntitiesEntries } from '@/types/parsed/entity';
import { FetchingParam } from '@/hooks/fetching-query-param-provider';
import { fetcher, API_URL } from '@/bin/data/fetcher';
import { EntityId } from '@/types/entity-id';
import { parseEntities } from '@/bin/data/parse/entities';
import {
  codingsParser,
  labelsParser,
  notationsParser,
  staNotationsParser,
} from '@/bin/data/parse';
import { prefetchEmbeddedEntities } from '@/bin/data/parse/entities/prefetch-embedded-entities';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { entityId, live } = req.query;
  if (typeof entityId === 'string') {
    if (live) {
      let entitiesEntries: EntitiesEntries;
      if (live === FetchingParam.prod) {
        entitiesEntries = await getLiveEntity(
          fetcher(API_URL.prod),
          entityId as EntityId
        );
      } else if (live === FetchingParam.test) {
        entitiesEntries = await getLiveEntity(
          fetcher(API_URL.test),
          entityId as EntityId
        );
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
    res.status(200).json(entities[entityId as keyof Entities]);
  }
  res.status(404);
};

const getLiveEntity = async (
  fetch: ReturnType<typeof fetcher>,
  entityId: EntityId
) => {
  const prefetched = {};

  await prefetchEmbeddedEntities({
    entityId,
    getRawEntityById: async (entityId: EntityId) => {
      if (entityId in prefetched) {
        return prefetched[entityId];
      } else {
        const fetchedEntity = await fetch.entities.single(entityId);
        prefetched[entityId] = fetchedEntity[entityId];
        return fetchedEntity;
      }
    },
  });

  const entity = prefetched[entityId];
  if (entity) {
    const lookup_en = labelsParser.en(await fetch.labels.en());
    const lookup_de = labelsParser.de(await fetch.labels.de());
    const notations = notationsParser(await fetch.notations());
    const codings = codingsParser(await fetch.codings());
    const staNotations = staNotationsParser(await fetch.staNotations());

    return await parseEntities({
      rawEntities: { [entityId]: entity },
      getRawEntityById: (id: EntityId) => prefetched[id],
      data: {
        lookup_en,
        lookup_de,
        notations,
        codings,
        staNotations,
      },
    });
  }
};
