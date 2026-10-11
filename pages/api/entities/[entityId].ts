import type { NextApiRequest, NextApiResponse } from 'next';
import { entityRepository } from '@/features/entity/entity-repository';
import { EntityId } from '@/types/entity-id';
import { FetchingParam, isReadStageParam } from '@/hooks/fetch-query-params-provider';
import { getLocaleFromReq } from '@/utils/locale-utils';
import { fetchViewRawServer } from '@/lib/api/editor-server-client';
import { viewRawToEntityEntry } from '@/lib/bff/view-raw-to-entity-entry';
import { isPostgresReadEnabledServer } from '@/lib/sta-editor-features';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const locale = getLocaleFromReq(req) || 'de';
    const entityId = req.query.entityId as EntityId;
    if (!entityId) {
      return res.status(400).json({ message: 'entityId is required' });
    }
    const live = req.query.live
      ? (req.query.live as FetchingParam)
      : undefined;
    const stageRaw =
      typeof req.query.stage === 'string' ? req.query.stage : undefined;
    const stage = isReadStageParam(stageRaw) ? stageRaw : undefined;

    if (stage && isPostgresReadEnabledServer()) {
      const viewRawResult = await fetchViewRawServer(entityId, {
        stage,
        language: locale,
        cookieHeader: req.headers.cookie,
      });

      if (viewRawResult.status === 401 || viewRawResult.status === 403) {
        return res.status(viewRawResult.status).json({
          message: viewRawResult.message ?? 'Unauthorized for staged read',
        });
      }

      if (!viewRawResult.data) {
        return res.status(viewRawResult.status).json({
          message: viewRawResult.message ?? 'Entity not found',
        });
      }

      const entityEntry = await viewRawToEntityEntry(
        viewRawResult.data,
        entityId,
        locale
      );
      if (entityEntry == null) {
        return res.status(404).json({ message: 'Entity not found' });
      }

      res.setHeader('Cache-Control', 'private, no-store');
      return res.status(200).json(entityEntry);
    }

    const entityData = await entityRepository.get(entityId, locale, live);
    if (entityData == null) {
      return res.status(404).json({ message: 'Entity not found' });
    }
    if (live === undefined) {
      res.setHeader(
        'Cache-Control',
        'public, max-age=3600, stale-while-revalidate=86400'
      );
    }

    return res.status(200).json(entityData);
  } catch (error: unknown) {
    console.error('Error fetching entity:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error:
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : undefined,
    });
  }
}
