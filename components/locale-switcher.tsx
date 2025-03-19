import { useRouter } from 'next/router';
import { Select } from 'antd';
import setLanguage from 'next-translate/setLanguage';

export default function localeSwitcher() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const handleChange  = (value: string) => {
    const { pathname, asPath, query } = router
    // change just the locale and maintain all other route information including href's query
    router.push({ pathname, query }, asPath, { locale: value })
  };

  return (
      <Select
        defaultValue={activeLocale}
        onChange={handleChange}
        style={{ width: 70 }}
        options={[
          { value: 'de', label: 'DE' },
          { value: 'fr', label: 'FR' },
        ]} />
  );
}

