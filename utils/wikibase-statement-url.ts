const DEFAULT_MEDIAWIKI_URL = 'https://edit.sta.dnb.de';

const normalizeWikiBase = (url: string): string => url.replace(/\/+$/, '');

/** Client-safe; do not import `@/lib/env` (uses Node `fs`). */
export const wikibaseStatementUrl = (
  statementId: string,
  baseUrl?: string
): string => {
  const entityId = statementId.split('$')[0];
  const namespace = entityId.startsWith('P') ? 'Property' : 'Item';
  const base = normalizeWikiBase(
    baseUrl ?? process.env.NEXT_PUBLIC_URL ?? DEFAULT_MEDIAWIKI_URL
  );

  return `${base}/wiki/${namespace}:${entityId}#${statementId}`;
};
