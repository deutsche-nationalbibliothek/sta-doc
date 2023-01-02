import type { NextApiRequest, NextApiResponse } from 'next';
import entites from '@/data/parsed/entities.json';
import { Entities, EntitiesEntries } from '@/types/parsed/entity';
import { FetchingParam } from '@/hooks/fetching-query-param-provider';
import { fetcher } from '@/bin/data/fetcher';
import { API_URL } from '@/bin/data/fetch';
import { EntityId } from '@/types/entity-id';
import { parseEntities } from '@/bin/data/parse/entities';
import { codingsParser, labelsParser, notationsParser } from '@/bin/data/parse';

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
        res.status(200).json(entitiesEntries[entityId].entity);
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
    res.status(200).json(entites[entityId as keyof Entities].entity);
  }
  res.status(404);
};

const getLiveEntity = async (
  fetch: ReturnType<typeof fetcher>,
  entityId: EntityId
) => {
  const getRawEntityById = async (id: EntityId) =>
    await fetch.entities.single(id);
  const entity = await getRawEntityById(entityId);
  if (entity) {
    const lookup_en = labelsParser.en(await fetch.labels.en());
    const lookup_de = labelsParser.de(await fetch.labels.de());
    const notations = notationsParser(await fetch.notations());
    const codings = codingsParser(await fetch.codings());

    return await parseEntities({
      rawEntities: { [entityId]: entity },
      getRawEntityById,
      data: {
        lookup_en,
        lookup_de,
        notations,
        codings,
      },
    });
  }
};
