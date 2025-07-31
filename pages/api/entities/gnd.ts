import { entityRepository } from '@/features/entity/entity-repository';
import { Namespace } from '@/types/namespace';
import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(entityRepository.getEntityIndexByNamespace(req.query.locale as string, Namespace.GND));
};