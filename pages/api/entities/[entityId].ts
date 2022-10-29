import type { NextApiRequest, NextApiResponse } from 'next';
import entites from '@/data/parsed/entities.json';
import { Entities } from '@/types/entity';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { entityId } = req.query;
  res.status(200).json(entites[entityId as keyof Entities]);
};
