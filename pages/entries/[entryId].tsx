import Head from 'next/head';
import Layout from '@/components/layout/layout';
import { Item } from '@/types/item';
import EntryType from '@/types/entry';
import Sidebar from '@/components/sidebar/sidebar';
import labelen from '@/data/parsed/labels-en.json';
import entities from '@/data/parsed/entities.json';
import TopNavigation from '@/components/layout/topNavigation';
import Details from '@/components/details';
import { GetStaticPaths, GetStaticProps } from 'next';

interface EntryProps {
  entry: EntryType;
}

interface WishedEntryProps {
  title: string;
  isRessourceTypePage: boolean;
}

export default function Entry({ entry }: EntryProps) {
  // console.log(entry);
  // if (entry.label && entry.statements.elementof && 'label' in entry.statements.elementof.occurrences[0]) {
  //   entry.statements.elementof.occurrences[0]
  // }

  const isRessourceTypePage =
    entry.pageType === Item['rda-ressourcetype'];

  return (
    <>
      <Head>
        <title>{entry.title}</title>
      </Head>
      <TopNavigation entry={entry} />
      <section className={'entry-content'}>
        {/* todo, sortStatements in api call */}
        <Details
          entry={{
            ...entry,
          }}
          isRessourceTypePage={isRessourceTypePage}
        />
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<
  EntryProps,
  { entryId: string }
> = async ({ params }) => {
  // get API data
  console.log({ params });
  const entry = entities[params.entryId.toUpperCase()];
  // console.log({ entry });

  if (!entry) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      entry,
    },
    // revalidate: 10, // In seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = labelen;
  const subsetOfEntries = Object.entries(entries).filter((entry) => {
    // console.log({ entry });
    return (
      'assignmentId' in entry[1] &&
      entry[1].assignmentId !== Item['stadocumentation:example']
    );
  });
  return {
    paths: subsetOfEntries.map((entry) => ({
      params: { entryId: entry[0].toString() },
    })),
    fallback: true,
  };
};

Entry.getLayout = (page: React.ReactNode) => (
  <Layout>
    <Sidebar active={page} />
    {page}
  </Layout>
);
