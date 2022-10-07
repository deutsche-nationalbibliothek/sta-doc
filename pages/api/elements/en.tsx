import {NextApiRequest, NextApiResponse} from 'next';
import labelsEn from '@/data/parsed/labels-de.json';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(labelsEn);
};
