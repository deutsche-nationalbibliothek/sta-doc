import { ReadStageParam } from '@/hooks/fetch-query-params-provider';
import { EntityRaw } from '@/types/raw/entity';

export interface ViewRawResponse {
  entities: Record<string, EntityRaw>;
  staNotations: Record<string, string>;
}

/**
 * Server-side calls go directly to WildFly (no Next rewrite loop).
 * Relative NEXT_PUBLIC_EDITOR_API_URL (/doc-backend/api) is ignored here.
 */
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

export async function fetchViewRawServer(
  entityId: string,
  options: {
    stage?: ReadStageParam;
    language?: string;
    cookieHeader?: string;
  } = {}
): Promise<{ data?: ViewRawResponse; status: number; message?: string }> {
  const stage = options.stage ?? 'working';
  const language = options.language ?? 'de';
  const url =
    `${serverApiBase()}/sta-content/entities/${encodeURIComponent(entityId)}` +
    `/view-raw?stage=${encodeURIComponent(stage)}&language=${encodeURIComponent(language)}`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(options.cookieHeader ? { Cookie: options.cookieHeader } : {}),
    },
  });

  const text = await response.text();
  let body: unknown = undefined;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const record =
      typeof body === 'object' && body !== null
        ? (body as Record<string, unknown>)
        : undefined;
    const message =
      typeof record?.message === 'string'
        ? record.message
        : typeof body === 'string'
          ? body
          : 'Editor API error';
    return { status: response.status, message };
  }

  return { data: body as ViewRawResponse, status: response.status };
}
