import { resolveEntityLocale } from '@/utils/locale-utils';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

/** Locale for entity API + parsed JSON (`entities-de` / `entities-fr`). */
export const useAppLocale = () => {
  const router = useRouter();
  const { lang } = useTranslation('common');
  return resolveEntityLocale(
    { locale: router.locale, asPath: router.asPath },
    lang
  );
};
