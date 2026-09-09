import { useRouter } from 'next/router';
import { Select } from 'antd';

export const LocaleSwitcher = () => {
  const router = useRouter();
  const { locale: activeLocale, pathname, asPath, query } = router;

  const handleChange = (value: string) => {
    if (value === activeLocale) return;

    void router
      .push({ pathname, query }, asPath, { locale: value, scroll: false })
      .catch((error: unknown) => {
        console.error('Error changing locale:', error);
      });
  };

  return (
    <Select
      value={activeLocale}
      onChange={handleChange}
      style={{ width: 70 }}
      options={[
        { value: 'de', label: 'DE' },
        { value: 'fr', label: 'FR' },
      ]}
    />
  );
};

export default LocaleSwitcher;