import { entityRepository } from '@/features/entity/entity-repository';
import { Namespace } from '@/types/namespace';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getLocaleFromReq } from '@/utils/locale-utils';

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(entityRepository.getEntityIndexByNamespace(getLocaleFromReq(req), Namespace.STA));
};
