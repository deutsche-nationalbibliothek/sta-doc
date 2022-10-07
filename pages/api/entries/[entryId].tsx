import entities from '@/data/parsed/entities.json';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { entryId } = req.query;
  if (typeof entryId === 'string') {
    res.status(200).json(entities[entryId]);
  } else {
    res.status(404).json({err: 'entryId is not of type string'});
  }
};
