import type { NextApiRequest, NextApiResponse } from 'next';
import { getEntityJson } from '../../entities/[entityId]';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    return getEntityJson("fr", req, res);
};