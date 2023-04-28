import fields from '@/data/parsed/fields.json';
import { Title } from '@/components/title';
import { NamespaceImage } from '@/entity/components/namespace-image';
import { useNamespace } from '@/hooks/use-namespace';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { GndFieldsTable } from 'features/gnd/field-table';
import { Field, Fields } from '@/types/parsed/field';
import { Namespace } from '@/types/namespace';
import { PageHeader } from '@/components/page-header';

export interface GndFieldsProps {
  fields: Field[];
}

export default function GndFields({ fields }: GndFieldsProps) {
  const { namespace, setNamespace } = useNamespace();

  useEffect(() => {
    setNamespace(Namespace.GND);
  }, [setNamespace]);

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
      fields: fields as Fields,
    },
  };
};
