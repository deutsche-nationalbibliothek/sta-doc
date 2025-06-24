import { NextApiRequest } from 'next';

export function getLocaleFromReq(req: NextApiRequest) {
  return normalizeLocale(req.query.locale);
}

export function normalizeLocale(localeToCheck: any): string {
  return typeof localeParam === 'string' && SUPPORTED_LOCALES.indexOf(localeToCheck) > 0 ? localeToCheck : DEFAULT_LOCALE;
}


export const SUPPORTED_LOCALES = ['de', 'fr', 'en'];
export const DEFAULT_LOCALE: string = 'de';