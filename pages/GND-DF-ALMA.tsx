import fields from '@/data/parsed/fields.json';
import { useRouter } from 'next/router';
import { Title } from '@/components/title';
import { useNamespace } from '@/hooks/use-namespace';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { GndFieldsTable, GndFieldsProps } from 'features/gnd/field-table';
import { Field, Fields } from '@/types/parsed/field';
import { Namespace } from '@/types/namespace';
import { PageHeader } from '@/components/page-header';
import useTranslation from 'next-translate/useTranslation';

export default function GndFields({ fields }: GndFieldsProps) {
  const filterFields = (obj: Fields) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key,field]) => field.codings.Alma.length !== 0)
    ) as Fields;
  };
  const fieldsAlma = filterFields(fields)
  const router = useRouter();
  const locale = router.locale || 'de';
  const { t } = useTranslation('common');
  const { setNamespace } = useNamespace();

  useEffect(() => {
    setNamespace(Namespace.GND);
  }, [setNamespace]);

  return (
    <>
      <Head>
        <title>{t('title-ALMA-list')}</title>
      </Head>

      <PageHeader
        title={
          <Title
            headline={{
              title: t('title-ALMA-list'),
              level: 1,
              key: 'GndIndex',
            }}
          />
        }
      />
      <GndFieldsTable fields={fieldsAlma} locale={locale} singleColumn={'Alma'} />
    </>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      fields: fields as unknown as Fields,
    },
  };
};
