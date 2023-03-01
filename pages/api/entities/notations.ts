import type { NextApiRequest, NextApiResponse } from 'next';
import notations from '@/data/parsed/sta-notations.json';
export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json(notations);
};
