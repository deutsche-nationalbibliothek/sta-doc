import { NextApiRequest } from 'next';

const SUPPORTED_LOCALES = ['de', 'fr', 'en']; // List of locales your application supports
const DEFAULT_LOCALE = 'de'; // Fallback locale if none is specified or invalid

/**
 * Normalizes a locale value to ensure it's valid and supported
 * @param localeToCheck - The locale value to validate (can be any type)
 * @returns The validated locale string, or default locale if invalid
 */
function normalizeLocale(localeToCheck: unknown): string {
  return (typeof localeToCheck === 'string') && SUPPORTED_LOCALES.indexOf(localeToCheck) > -1 ? localeToCheck : DEFAULT_LOCALE;
}

/**
 * Path prefix for Next.js i18n routing (default locale has no prefix).
 */
export function getLocalePathPrefix(locale?: string | null): string {
  const normalized = normalizeLocale(locale);
  return normalized === DEFAULT_LOCALE ? '' : `/${normalized}`;
}

/**
 * Builds an absolute app path including basePath and locale prefix.
 * @param path - Path starting with `/` (asPath-style, without locale)
 */
export function buildLocalizedAppPath(
  path: string,
  locale?: string | null
): string {
  const basePath = process.env.basePath ?? '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${getLocalePathPrefix(locale)}${normalizedPath}`;
}

/**
 * Adds or updates a locale parameter in a URL string
 * @param url - The base URL to modify
 * @param localeParam - The locale value to add to the URL
 * @returns The modified URL with locale parameter
 */
export function setLocaleParam(url : string, localeParam : unknown) : string {
  const delimiter : string =(url.indexOf('?') > -1) ? '&' : '?'; // Determine if we need ? or & for URL params
  return url + delimiter + "locale=" + normalizeLocale(localeParam);
}

/**
 * Extracts and validates the locale from a Next.js API request
 * @param req - The Next.js API request object
 * @returns The validated locale from query params, or default locale if not specified
 */
export function getLocaleFromReq(req: NextApiRequest) {
  return normalizeLocale(req.query.locale);
}