import { NextApiRequest, NextApiResponse } from 'next';
import codings from '@/data/parsed/codings.json';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { codingId } = req.query;
  if (typeof codingId === 'string') {
    const coding = codings[codingId];
    res.status(200).json(coding);
  } else {
    res.status(404).json({err: 'codingId is not of type string'});
  }
};
