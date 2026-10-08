const DEFAULT_MEDIAWIKI_URL = 'https://edit.sta.dnb.de';
const DEFAULT_API_URL_LIVE = 'https://sta.dnb.de';
const DEFAULT_API_URL_PROD = 'https://edit.sta.dnb.de';
const DEFAULT_API_URL_TEST = 'http://lab.sta.dnb.de';

export const hostnameFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
};

export const mediawikiUrl = (): string =>
  canonicalWikiBase(process.env.NEXT_PUBLIC_URL || DEFAULT_MEDIAWIKI_URL);

export const mediawikiFetchUrl = (): string | undefined =>
  process.env.MEDIAWIKI_FETCH_URL?.trim() || undefined;

export const normalizeWikiBase = (url: string): string =>
  url.replace(/\/+$/, '');

/** Hosts where HTTP is expected (local MediaWiki); public wiki IRIs use HTTPS. */
const LOCAL_MEDIAWIKI_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  'mediawiki.svc',
]);

/**
 * Wikibase stores entity IRIs with https. SPARQL PREFIXes must match that scheme;
 * plain http:// on a public host yields empty query results.
 */
export const canonicalWikiBase = (url: string): string => {
  const normalized = normalizeWikiBase(url);
  try {
    const parsed = new URL(normalized);
    if (
      parsed.protocol === 'http:' &&
      !LOCAL_MEDIAWIKI_HOSTS.has(parsed.hostname)
    ) {
      parsed.protocol = 'https:';
      return normalizeWikiBase(parsed.toString());
    }
  } catch {
    // keep normalized string as-is
  }
  return normalized;
};

/**
 * HTTP base for Wikibase API/SPARQL requests. Public hosts are reached over plain
 * HTTP when TLS is unavailable; SPARQL PREFIXes still use {@link canonicalWikiBase}.
 */
export const mediawikiTransportUrl = (canonicalBase: string): string => {
  const canonical = canonicalWikiBase(canonicalBase);
  try {
    const parsed = new URL(canonical);
    if (
      parsed.protocol === 'https:' &&
      !LOCAL_MEDIAWIKI_HOSTS.has(parsed.hostname)
    ) {
      parsed.protocol = 'http:';
      return normalizeWikiBase(parsed.toString());
    }
  } catch {
    // keep canonical string as-is
  }
  return canonical;
};

export const resolveMediawikiFetchUrl = (canonicalBase: string): string => {
  const fetchUrl = mediawikiFetchUrl();
  if (!fetchUrl) {
    return mediawikiTransportUrl(canonicalBase);
  }
  const canonical = canonicalWikiBase(canonicalBase);
  const localCanonicals = new Set(
    [mediawikiUrl(), apiUrlProd()].map(canonicalWikiBase)
  );
  if (localCanonicals.has(canonical)) {
    return normalizeWikiBase(fetchUrl);
  }
  return mediawikiTransportUrl(canonicalBase);
};

export const isLocalMediawikiFetch = (canonicalBase: string): boolean => {
  const fetchUrl = mediawikiFetchUrl();
  if (!fetchUrl) {
    return false;
  }
  const canonical = canonicalWikiBase(canonicalBase);
  const localCanonicals = new Set(
    [mediawikiUrl(), apiUrlProd()].map(canonicalWikiBase)
  );
  return localCanonicals.has(canonical);
};

export const mediawikiFetchDiffersFromCanonical = (
  canonicalBase: string
): boolean =>
  resolveMediawikiFetchUrl(canonicalBase) !== canonicalWikiBase(canonicalBase);

export const apiUrlLive = (): string =>
  canonicalWikiBase(process.env.API_URL_LIVE || DEFAULT_API_URL_LIVE);

export const apiUrlProd = (): string =>
  canonicalWikiBase(process.env.API_URL_PROD || DEFAULT_API_URL_PROD);

export const apiUrlTest = (): string =>
  canonicalWikiBase(process.env.API_URL_TEST || DEFAULT_API_URL_TEST);
