import fields from '@/data/parsed/fields.json';
import { Title } from '@/components/title';
import { DataSourceImage } from '@/entity/components/datasource-image';
import { useDataSource } from '@/hooks/use-pagetype';
import { DataSource } from '@/types/entity';
import { PageHeader } from 'antd';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { GndFieldsTable } from 'features/gnd/field-table';
import { Field } from '@/types/field';

export interface GndFieldsProps {
  fields: Field[];
}

export default function GndFields({ fields }: GndFieldsProps) {
  const { dataSource, setDataSource } = useDataSource();

  useEffect(() => {
    setDataSource(DataSource.GND);
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
        extra={dataSource && <DataSourceImage />}
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
