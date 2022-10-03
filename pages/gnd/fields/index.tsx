import Head from 'next/head';
import Layout from '@/components/layout/layout';
import Sidebar from '@/components/sidebar/sidebar';
import GndNavigation from '@/components/layout/gndNavigation';
import { getFields } from '@/lib/api';
import FieldTable from '@/components/tables/FieldTable';

export default function Fields({ list }) {
  // console.log('list',list)
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

export async function getStaticProps() {
  const list = await getFields();
  return {
    props: {
      list: [...list],
    },
    revalidate: 1000,
  };
}

Fields.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar active={page} />
      {page}
    </Layout>
  );
};
