import { Namespace } from '@/types/namespace';
import { entitiesByNamespace } from '@/utils/entities-by-namespace';
import type { NextApiRequest, NextApiResponse } from 'next';

export default (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(entitiesByNamespace(Namespace.GND));
};
