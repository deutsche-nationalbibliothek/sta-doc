import { PageHeader } from '@/components/page-header';
import { SolrSearch } from '@/components/search/solr';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useNamespace } from '@/hooks/use-namespace';
import { useEffect } from 'react';

const SearchPage: React.FC = () => {
  const { setNamespace } = useNamespace();
  const { setHeadlines } = useInitialHeadlines();

  useEffect(() => {
    setHeadlines([]);
    setNamespace(undefined);
  }, [setHeadlines, setNamespace]);

  return (
    <div className="search-page">
      <PageHeader title={'Suche'} />
      <SolrSearch />
    </div>
  );
};

export default SearchPage;
