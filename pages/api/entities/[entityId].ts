import type { NextApiRequest, NextApiResponse } from 'next';
import { entityRepository } from '@/features/entity/entity-repository';
import { EntityId } from '@/types/entity-id';
import { FetchingParam } from '@/hooks/fetch-query-params-provider';
import { getLocaleFromReq } from '@/utils/locale-utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return getEntityJson(getLocaleFromReq(req), req, res);
};

export async function getEntityJson(language: string | undefined, req: NextApiRequest, res: NextApiResponse) {
    res.json(await entityRepository.get(
    req.query.entityId as EntityId,
    language,
    req.query.live as FetchingParam
  ));
}