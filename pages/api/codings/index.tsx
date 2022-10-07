import { NextApiRequest, NextApiResponse } from 'next';
import codings from '@/data/parsed/codings.json';

export default (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(codings);
}
