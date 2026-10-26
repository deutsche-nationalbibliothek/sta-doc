import { useEffect, useState } from 'react';
import { getStaContent, type StaEntryDto } from '@/lib/api/editor-client';
import { isEntityIdValue } from '@/lib/api/sta-content-types';

const entryCache = new Map<string, StaEntryDto | null>();
const inflight = new Map<string, Promise<StaEntryDto | null>>();

async function resolveStaEntry(entityId: string): Promise<StaEntryDto | null> {
  const key = entityId.trim();
  if (entryCache.has(key)) {
    return entryCache.get(key) ?? null;
  }
  const pending = inflight.get(key);
  if (pending) {
    return pending;
  }
  const request = getStaContent(key)
    .then((result) => {
      const entry = result.data ?? null;
      entryCache.set(key, entry);
      return entry;
    })
    .catch(() => {
      entryCache.set(key, null);
      return null;
    })
    .finally(() => {
      inflight.delete(key);
    });
  inflight.set(key, request);
  return request;
}

/** Drop cache so the next useStaEntry fetch returns fresh Working Copy. */
export function invalidateStaEntry(entityId: string): void {
  const key = entityId.trim();
  entryCache.delete(key);
  inflight.delete(key);
}

/** Force-fetch and update cache (e.g. after save). */
export async function reloadStaEntry(
  entityId: string
): Promise<StaEntryDto | null> {
  invalidateStaEntry(entityId);
  return resolveStaEntry(entityId);
}

/**
 * Loads a StaEntry (working copy) for read-only preview. Cached per entity id.
 */
export function useStaEntry(entityId: string | undefined): {
  entry?: StaEntryDto;
  loading: boolean;
  missing: boolean;
} {
  const normalized =
    entityId && isEntityIdValue(entityId) ? entityId.trim() : undefined;
  const cached =
    normalized && entryCache.has(normalized)
      ? entryCache.get(normalized) ?? undefined
      : undefined;
  const [entry, setEntry] = useState<StaEntryDto | undefined>(cached);
  const [loading, setLoading] = useState(
    Boolean(normalized && !entryCache.has(normalized))
  );
  const [missing, setMissing] = useState(
    Boolean(normalized && entryCache.has(normalized) && !entryCache.get(normalized))
  );

  useEffect(() => {
    if (!normalized) {
      setEntry(undefined);
      setLoading(false);
      setMissing(false);
      return;
    }
    if (entryCache.has(normalized)) {
      const cachedEntry = entryCache.get(normalized) ?? undefined;
      setEntry(cachedEntry);
      setMissing(!cachedEntry);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    resolveStaEntry(normalized).then((resolved) => {
      if (!cancelled) {
        setEntry(resolved ?? undefined);
        setMissing(!resolved);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [normalized]);

  return { entry, loading, missing };
}
