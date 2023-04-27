import { PageHeader } from '@/components/page-header';
import { SolrSearch } from '@/components/search/solr';
import { useSolrSearch } from '@/hooks/use-solr-search';
import { Typography } from 'antd';
import Head from 'next/head';

const SearchPage: React.FC = () => {
  const { query } = useSolrSearch();

  return (
    <>
      <Head>
        <title>Suche {query && `- ${query}`}</title>
      </Head>

      <div
        css={{
          width: '60%',
          margin: 'auto',
          '@media screen and (max-width: 900px)': {
            width: '100%',
          },
        }}
      >
        <PageHeader title={<Typography.Title>Suche</Typography.Title>} />
        <SolrSearch />
      </div>
    </>
  );
};

export default SearchPage;
