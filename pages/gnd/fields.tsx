import fields from '@/data/parsed/fields.json';
import { Title } from '@/components/title';
import { NamespaceImage } from '@/entity/components/namespace-image';
import { useNamespace } from '@/hooks/use-namespace';
import { PageHeader } from 'antd';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { GndFieldsTable } from 'features/gnd/field-table';
import { Field } from '@/types/parsed/field';
import { Namespace } from '@/types/namespace';
import { useInitialHeadlines } from '@/hooks/initial-headlines';

export interface GndFieldsProps {
  fields: Field[];
}

export default function GndFields({ fields }: GndFieldsProps) {
  const { namespace, setNamespace } = useNamespace();
  const { setHeadlines } = useInitialHeadlines();

  useEffect(() => {
    setNamespace(Namespace.GND);
    setHeadlines([]);
  }, []);

  return (
    <>
      <Head>
        <title>GND Feld-/Unterfeldliste</title>
      </Head>

      <PageHeader
        title={
          <Title
            headline={{
              title: 'GND Feld-/Unterfeldliste',
              level: 1,
              key: 'GndIndex',
            }}
          />
        }
        extra={namespace && <NamespaceImage />}
      />
      <GndFieldsTable fields={fields} />
    </>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      fields,
    },
  };
};
