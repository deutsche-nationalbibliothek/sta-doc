import Head from 'next/head';
import { GetStaticProps } from 'next';
import Layout from '@/components/layout/layout';
import Sidebar from '@/components/sidebar/sidebar';
import TopNavigation from '@/components/layout/topNavigation';
import entities from '@/data/parsed/entities.json';
import Details from '@/components/details';
import Entry from '@/types/entry';

interface RdaProps {
  entry: Entry;
}

export default function Rda({ entry }: RdaProps) {
  const title =
    entry.label && entry.statements.elementof
      ? entry.label + ' | ' + entry.statements.elementof.occurrences[0].label
      : 'missing german entity label';
  // const ressourceTypePage =
  // entry.statements.elements &&
  // entry.statements.elementof.occurrences[0].id === Item["rda-ressourcetype"];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <TopNavigation entry={entry} />
      <section className={'entry-content'}>
        {/* todo, sortStatements in api call */}
        <Details
          entry={{
            ...entry,
          }}
        // ressourceTypePage={ressourceTypePage}
        />
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const entry = entities['Q8469'];

  if (!entry) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      entry: { ...entry },
    },
    // revalidate: 10, // In seconds
  };
};

Rda.getLayout = (page: React.ReactNode) => (
  <Layout>
    <Sidebar active={page} />
    {page}
  </Layout>
);
