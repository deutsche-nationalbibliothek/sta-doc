import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router';

export const Test = () => {
  const { t } = useTranslation('common')
  const router = useRouter();
  const { locale } = router;

  return (
    <>
      <p>TEST</p>
      <p>{locale}</p>
      <p>{t('title')}</p>
    </>
  );
};

export default Test;

