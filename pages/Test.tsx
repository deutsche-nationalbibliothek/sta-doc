import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router';

export const Test = () => {
  const { t, lang } = useTranslation('common')
  const router = useRouter();
  const { locale, locales, defaultLocale } = router;

  return (
    <>
      <p>TEST</p>
      <p>{locale}</p>
      <p>{t('title')}</p>
    </>
  );
};

export default Test;


// export const getStaticProps =
//  async ({ locale } : { locale: any}) => ({
//  props: { ...(await serverSideTranslations(locale, ['common'])) },
//});

