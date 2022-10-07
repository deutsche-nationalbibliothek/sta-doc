import Layout from '@/components/layout/layout';
import Sidebar from '@/components/sidebar/sidebar';
import Head from 'next/head';
import RdaNavigation from '@/components/layout/RdaNavigation';
import rdaProperties from '@/data/parsed/rda-properties.json';
import RdaTable from '@/components/tables/RdaTable';
import { GetStaticProps } from 'next';
import { RdaProperty } from '@/types/generated/rda-property';

interface RdaPropertiesPageProps {
  list: RdaProperty[];
}

export default function RdaPropertiesPage({ list }: RdaPropertiesPageProps) {
  return (
    <>
      <Head>
        <title>RDA Eigenschaften</title>
      </Head>
      <RdaNavigation />
      <section>
        <h1>RDA Eigenschaften</h1>
        <RdaTable data={list} />
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const list = rdaProperties;
  return {
    props: {
      list,
    },
    revalidate: 10,
  };
};

RdaPropertiesPage.getLayout = (page: React.ReactNode) => (
  <Layout>
    <Sidebar active={page} />
    {page}
  </Layout>
);
