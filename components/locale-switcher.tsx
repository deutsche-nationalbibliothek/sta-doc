import { useRouter } from 'next/router';
import { Select } from 'antd';
import { useEffect, useState } from 'react';

export const LocaleSwitcher = () => {
  const router = useRouter();
  const { locale: activeLocale, pathname, asPath, query } = router;
  const [currentLocale, setCurrentLocale] = useState(activeLocale);

  useEffect(() => {
    setCurrentLocale(activeLocale);
  }, [activeLocale]);

  const handleChange = async (value: string) => {
    if (value === currentLocale) return;

    try {
      await router.push(
        { pathname, query },
        asPath,
        { locale: value, scroll: false }
      );
    } catch (error) {
      console.error('Error changing locale:', error);
    }
  };

  return (
    <Select
      value={currentLocale}
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