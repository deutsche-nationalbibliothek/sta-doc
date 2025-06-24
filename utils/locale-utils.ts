import { NextApiRequest } from 'next';

export function getLocaleFromReq(req: NextApiRequest) {
  return normalizeLocale(req.query.locale);
}

export function normalizeLocale(localeToCheck: any): string {
  return (typeof localeToCheck === 'string') && SUPPORTED_LOCALES.indexOf(localeToCheck) > 0 ? localeToCheck : DEFAULT_LOCALE;
}

export function setLocaleParam(url : string, localeParam : any) : string {
  let delimiter : string =(url.indexOf('?') > 0) ? '&' : '?';
  return url + delimiter + "locale=" + normalizeLocale(localeParam);
}


export const SUPPORTED_LOCALES = ['de', 'fr', 'en'];
export const DEFAULT_LOCALE: string = 'de';