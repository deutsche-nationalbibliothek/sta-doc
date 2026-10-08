import type { NextApiRequest, NextApiResponse } from 'next';
import { entityRepository } from '@/features/entity/entity-repository';
import { getLocaleFromReq } from '@/utils/locale-utils';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const locale = getLocaleFromReq(req);
    const idLookup = entityRepository.getIdLookup(locale);

    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400'
    );

    return res.status(200).json(idLookup);
  } catch (error: unknown) {
    console.error('Error fetching id lookup:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error:
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : undefined,
    });
  }
}
