import fields from '@/data/parsed/fields.json';
import { Title } from '@/components/title';
import { DataSourceImage } from '@/entity/components/datasource-image';
import { useDataSource } from '@/hooks/use-pagetype';
import { DataSource } from '@/types/entity';
import { PageHeader, Typography } from 'antd';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

export default function GndFields({fields}) {
  console.log(fields)
  const { dataSource, setDataSource } = useDataSource();

  useEffect(() => {
    setDataSource(DataSource.GND);
  }, []);

  return (
    <>
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
        <Typography.Text>Not yet, coming soon</Typography.Text>
      </>
    </>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      fields
    },
  };
};
