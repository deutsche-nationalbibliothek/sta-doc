import { NextApiRequest, NextApiResponse } from 'next';
import entityIndex from '@/data/parsed/entities-index.json';

export default (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(entityIndex);
};
