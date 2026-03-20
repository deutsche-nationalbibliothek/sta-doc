import type { NextApiRequest, NextApiResponse } from 'next';
import { entityRepository } from '@/features/entity/entity-repository';
import { EntityId } from '@/types/entity-id';
import { FetchingParam } from '@/hooks/fetch-query-params-provider';
import { getLocaleFromReq } from '@/utils/locale-utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    // Get locale from request (with fallback to default)
    const locale = getLocaleFromReq(req) || 'de';

    // Validate entityId parameter
    const entityId = req.query.entityId as EntityId;
    if (!entityId) {
      return res.status(400).json({ message: 'entityId is required' });
    }

    // Only fetch live data if explicitly requested
    const live = req.query.live ? req.query.live as FetchingParam : undefined;

    // Fetch entity data
    const entityData = await entityRepository.get(entityId, locale, live);

    // Set caching headers for better performance
    if (live === undefined){ res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');}

    // Return the data
    return res.status(200).json(entityData);
  } catch (error) {
    console.error('Error fetching entity:', error);

    // Handle different types of errors
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}