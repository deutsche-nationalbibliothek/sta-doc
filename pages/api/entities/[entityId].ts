import type { NextApiRequest, NextApiResponse } from 'next';
import { getEntityJson } from '@/utils/get-entities';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return getEntityJson("de", req, res);
};