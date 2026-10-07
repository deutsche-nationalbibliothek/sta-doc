import { entityRepository } from '@/features/entity/entity-repository';
import { Namespace } from '@/types/namespace';
import { getLocaleFromReq } from '@/utils/locale-utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(
    entityRepository.getEntityIndexByNamespace(getLocaleFromReq(req), Namespace.GND)
  );
};