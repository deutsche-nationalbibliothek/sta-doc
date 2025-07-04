import type { NextApiRequest, NextApiResponse } from 'next';
import { entityRepository } from '@/features/entity/entity-repository';
import { EntityId } from '@/types/entity-id';
import { FetchingParam } from '@/hooks/fetch-query-params-provider';
// import { getLocaleFromReq } from '@/utils/locale-utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return getEntityJson(req, res);
};

export async function getEntityJson(req: NextApiRequest, res: NextApiResponse) {
  res.json(await entityRepository.get(
    req.query.entityId as EntityId,
    req.query.locale as FetchingParam,
    req.query.live as FetchingParam
  ));
}