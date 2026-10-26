import { StaCatalogEntryDto } from '@/lib/api/catalog-types';
import { EntityIndex } from '@/types/parsed/entity-index';
import { Namespace } from '@/types/namespace';
import { isPostgresReadEnabledServer } from '@/lib/sta-editor-features';
import type { NextApiRequest } from 'next';

const serverApiBase = (): string => {
  const fromEnv =
    process.env.EDITOR_API_URL ||
    process.env.EDITOR_API_UPSTREAM ||
    '';
  if (fromEnv && /^https?:\/\//i.test(fromEnv)) {
    return fromEnv.replace(/\/$/, '');
  }
  const pub = process.env.NEXT_PUBLIC_EDITOR_API_URL || '';
  if (pub && /^https?:\/\//i.test(pub)) {
    return pub.replace(/\/$/, '');
  }
  return 'http://localhost:8080/sta-doc-api/api';
};

function normalizeStaNotation(value: string): string {
  return value.trim().toUpperCase();
}

function mapCatalogToEntityIndex(items: StaCatalogEntryDto[]): EntityIndex[] {
  return items.map((item) => ({
    id: item.entityId as EntityIndex['id'],
    label: item.title || item.entityId,
    staNotationLabel: item.staNotation || item.entityId,
    pageTypeLabel: item.pageTypeLabel ?? undefined,
  }));
}

async function fetchWorkingCatalogItems(
  cookieHeader: string | undefined,
  language: string,
  queryParams: Record<string, string>
): Promise<StaCatalogEntryDto[] | null> {
  if (!isPostgresReadEnabledServer()) {
    return null;
  }
  const params = new URLSearchParams();
  params.set('stage', 'working');
  params.set('language', language);
  for (const [key, value] of Object.entries(queryParams)) {
    params.set(key, value);
  }
  const url = `${serverApiBase()}/sta-content/catalog/entities?${params.toString()}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });
  if (!response.ok) {
    return null;
  }
  const body = (await response.json()) as { items?: StaCatalogEntryDto[] };
  return body.items ?? [];
}

/** Resolve a working-copy page created in Postgres but absent from data/parsed SSG index. */
export async function fetchWorkingCatalogEntryByStaNotation(
  cookieHeader: string | undefined,
  staNotationLabel: string,
  language: string
): Promise<StaCatalogEntryDto | null> {
  const normalized = normalizeStaNotation(staNotationLabel);
  const items = await fetchWorkingCatalogItems(cookieHeader, language, {
    q: normalized,
    limit: '50',
  });
  if (!items) {
    return null;
  }
  return (
    items.find(
      (item) =>
        item.staNotation &&
        normalizeStaNotation(item.staNotation) === normalized
    ) ?? null
  );
}

export async function fetchWorkingCatalogIndex(
  req: NextApiRequest,
  namespace: Namespace,
  language: string
): Promise<EntityIndex[] | null> {
  const stage = typeof req.query.stage === 'string' ? req.query.stage : undefined;
  if (stage !== 'working' || !isPostgresReadEnabledServer()) {
    return null;
  }
  const items = await fetchWorkingCatalogItems(req.headers.cookie, language, {
    namespace,
    limit: '5000',
  });
  if (!items) {
    return null;
  }
  return mapCatalogToEntityIndex(items);
}
