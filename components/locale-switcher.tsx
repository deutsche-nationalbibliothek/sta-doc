import { useRouter } from 'next/router';
import { Select } from 'antd';

const LocaleSwitcher = () => {
  const router = useRouter();
  const { locale: activeLocale } = router;

  const handleChange = async (value: string) => {
    const { pathname, asPath, query } = router;
    try {
      await router.push({ pathname, query }, asPath, { locale: value });
    } catch (error) {
      console.error('Error changing locale:', error);
    }
  };
  const handleSelectChange = (value: string) => {
    void handleChange(value);
  };

  return (
    <Select
      defaultValue={activeLocale}
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