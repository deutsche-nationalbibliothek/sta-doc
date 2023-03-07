import { SearchResult } from '@/types/search';
import { AutoComplete, Input } from 'antd';
import { debounce } from 'lodash';
import { useState, useCallback, useEffect } from 'react';
import { useSWR } from '@/lib/swr';
import { SearchResults } from './results-list';
import { StringValueComponent } from '@/entity/components/values/string';

export interface SolrQueryFetcherOptions {
  query: string;
  start?: number;
}

export const SolrSearch = () => {
  console.log('export const SolrSearch = () => {');
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
      console.log('fetching search query', query);
      solrQueryFetcher({ query });
    }
  }, [query]);

  // console.log({suggestions: searchResult?.suggestions.suggest.mySuggester[query].suggestions})

  return (
    <div>
      <AutoComplete
        style={{ width: '100%' }}
        onSelect={(value: string) =>
          setQuery(value.replaceAll(/(<([^>]+)>)/g, ''))
        }
        options={
          query &&
          searchResult?.suggestions.spellcheck.suggestions[1] &&
          searchResult?.suggestions.spellcheck.suggestions[1].suggestion
            .sort((s1, s2) => s2.freq - s1.freq)
            .map((x, index) => ({
              value: x.word,
              key: index,
              label: (
                <>
                  <StringValueComponent stringValue={{ value: x.word }} />
                </>
              ),
            }))
        }
      >
        <Input.Search onChange={debounce(onSearch, 400)} enterButton={false} />
      </AutoComplete>
      <SearchResults
        solrQueryFetcher={solrQueryFetcher}
        queryResult={searchResult?.query}
        loading={!(query && !loading) && !!query && loading}
        query={query}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
