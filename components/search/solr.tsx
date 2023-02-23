import { SearchResult } from '@/types/search';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { useState, useCallback, useEffect } from 'react';
import { useSWR } from '@/lib/swr';
import { SearchResults } from './results-list';

export interface SolrQueryFetcherOptions {
  query: string;
  start?: number;
}

export const SolrSearch = () => {
  const [query, setQuery] = useState('');
  const [urlQuery, setUrlQuery] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);

  const onSearch = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const { data: searchResult, loading } = useSWR<SearchResult>(urlQuery);

  console.log({ searchResult, loading });

  const solrQueryFetcher = useCallback(
    ({ query, start }: SolrQueryFetcherOptions) => {
      setUrlQuery(
        `/api/entities/search?query=${query}${
          start ? '&start=' + String(start) : ''
        }`
      );
    },
    []
  );

  useEffect(() => {
    if (query) {
      solrQueryFetcher({ query });
    }
  }, [query]);

  return (
    <div>
      <Input.Search
        placeholder="does not work yet"
        onChange={debounce(onSearch, 400)}
        enterButton={false}
      />
      <SearchResults
        solrQueryFetcher={solrQueryFetcher}
        searchResult={searchResult}
        loading={!(query && !loading) && !!query && loading}
        query={query}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
