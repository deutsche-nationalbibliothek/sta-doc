import { useEffect, useState } from 'react';
import { getStaContent } from '@/lib/api/editor-client';
import { isEntityIdValue } from '@/lib/api/sta-content-types';

const labelCache = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

async function resolveEntityLabel(entityId: string): Promise<string | null> {
  const key = entityId.trim();
  if (labelCache.has(key)) {
    return labelCache.get(key) ?? null;
  }
  const pending = inflight.get(key);
  if (pending) {
    return pending;
  }
  const request = getStaContent(key)
    .then((result) => {
      const title =
        result.data?.title?.trim() ||
        result.data?.labels?.find((label) => label.value?.trim())?.value?.trim() ||
        null;
      labelCache.set(key, title);
      return title;
    })
    .catch(() => {
      labelCache.set(key, null);
      return null;
    })
    .finally(() => {
      inflight.delete(key);
    });
  inflight.set(key, request);
  return request;
}

/**
 * Resolves a Q…/P… id to the Working-Copy title (or first label) for display.
 * The stored value remains the raw id.
 */
export function useEntityLabel(entityId: string | undefined): {
  label?: string;
  loading: boolean;
} {
  const normalized =
    entityId && isEntityIdValue(entityId) ? entityId.trim() : undefined;
  const cached =
    normalized && labelCache.has(normalized)
      ? labelCache.get(normalized) ?? undefined
      : undefined;
  const [label, setLabel] = useState<string | undefined>(cached);
  const [loading, setLoading] = useState(
    Boolean(normalized && !labelCache.has(normalized))
  );

  useEffect(() => {
    if (!normalized) {
      setLabel(undefined);
      setLoading(false);
      return;
    }
    if (labelCache.has(normalized)) {
      setLabel(labelCache.get(normalized) ?? undefined);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    resolveEntityLabel(normalized).then((resolved) => {
      if (!cancelled) {
        setLabel(resolved ?? undefined);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [normalized]);

  return { label, loading };
}
