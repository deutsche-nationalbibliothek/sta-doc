import { useRouter } from 'next/router';
import { Select } from 'antd';
import { useState, useEffect } from 'react';

const LocaleSwitcher = () => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const [selectedLocale, setSelectedLocale] = useState(router.locale);

  useEffect(() => {
    if (router.locale !== selectedLocale) {
      setSelectedLocale(router.locale);
    }
  }, [router.locale, selectedLocale]);

  const handleChange = async (value: string) => {
    setSelectedLocale(value);
    const { pathname, asPath } = router;
    try {
      await router.push({ pathname, query: {} }, asPath, { locale: value });
    } catch (error) {
      console.error('Error changing locale:', error);
    }
  };
  const handleSelectChange = (value: string) => {
    void handleChange(value);
  };

  return (
    <Select
      value={activeLocale}
      onChange={handleSelectChange}
      style={{ width: 70 }}
      options={[
        { value: 'de', label: 'DE' },
        { value: 'fr', label: 'FR' },
      ]}
    />
  );
};

export default LocaleSwitcher;