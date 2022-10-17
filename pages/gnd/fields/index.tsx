import Head from 'next/head';
import Layout from '@/components/layout/layout';
import Sidebar from '@/components/sidebar/sidebar';
import GndNavigation from '@/components/layout/gndNavigation';
import fields from '@/data/parsed/fields.json';
import FieldTable from '@/components/tables/FieldTable';
import { GetStaticProps } from 'next';
import { Field } from '@/types/generated/field';

interface FieldsProps {
  list: Field[];
}

export default function Fields({ list }: FieldsProps) {
  return (
    <>
      <Head>
        <title>GND Feld-/Unterfeldliste</title>
      </Head>
      <GndNavigation />
      <section>
        <h1>GND Feld-/Unterfeldliste</h1>
        <FieldTable data={list} />
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const list = fields;
  // console.log(list)
  return {
    props: {
      list,
    },
    revalidate: 1000,
  };
};

Fields.getLayout = (page: React.ReactNode) => (
  <Layout>
    <Sidebar active={page} />
    {page}
  </Layout>
);
