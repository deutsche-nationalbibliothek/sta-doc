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