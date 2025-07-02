import { NextApiRequest } from 'next';

const SUPPORTED_LOCALES = ['de', 'fr', 'en'];
const DEFAULT_LOCALE = 'de';

function normalizeLocale(localeToCheck: unknown): string {
  return (typeof localeToCheck === 'string') && SUPPORTED_LOCALES.indexOf(localeToCheck) > -1 ? localeToCheck : DEFAULT_LOCALE;
}

export function setLocaleParam(url : string, localeParam : unknown) : string {
  const delimiter : string =(url.indexOf('?') > -1) ? '&' : '?';
  return url + delimiter + "locale=" + normalizeLocale(localeParam);
}

export function getLocaleFromReq(req: NextApiRequest) {
  return normalizeLocale(req.query.locale);
}