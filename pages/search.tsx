import { PageHeader } from '@/components/page-header';
import { SolrSearch } from '@/components/search/solr';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useNamespace } from '@/hooks/use-namespace';
import { Typography } from 'antd';
import { useEffect } from 'react';

const SearchPage: React.FC = () => {
  const { setNamespace } = useNamespace();
  const { setHeadlines } = useInitialHeadlines();
  const { onResetNamespace } = useNamespace();

  useEffect(() => {
    setHeadlines([]);
    setNamespace(undefined);
    onResetNamespace();
  }, [setHeadlines, setNamespace, onResetNamespace]);

  return (
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
  );
};

export default SearchPage;
