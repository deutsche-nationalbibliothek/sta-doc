import { StringValueComponent } from '@/entity/components/values/string';
import { useSearchQueryParams } from '@/hooks/search-query-params-provider';
import { useSWR } from '@/lib/swr';
import { SearchResult } from '@/types/search';
import { AutoComplete, Input } from 'antd';
import { debounce } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { SearchResults } from './results-list';

export interface SolrQueryFetcherOptions {
  query: string;
}

export const SolrSearch = () => {
  const {
    searchQuery: query,
    setSearchQuery: setQuery,
    page: currentPage,
    setPage: setCurrentPage,
  } = useSearchQueryParams();
  const [urlQuery, setUrlQuery] = useState<string>();

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value || '');
    setCurrentPage(1);
  };

  const { data: searchResult, loading } = useSWR<SearchResult>(urlQuery, true);

  useEffect(() => {
    if (query) {
      const pageSize = 10;
      setUrlQuery(
        `/api/entities/search?query=${query}${
          '&start=' + String((currentPage - 1) * pageSize)
        }`
      );
    }
  }, [query, currentPage]);

  const isLoadingIfQuery = !(query && !loading) && !!query && loading;

  return (
    <div>
      <AutoComplete
        style={{ width: '100%' }}
        onSelect={(value: string) =>
          setQuery(value.replaceAll(/(<([^>]+)>)/g, ''))
        }
        defaultValue={query}
        options={
          query &&
          searchResult?.suggestions.spellcheck.suggestions[1] &&
          searchResult?.suggestions.spellcheck.suggestions[1].suggestion
            .sort((s1, s2) => s2.freq - s1.freq)
            .map((x, index) => ({
              value: x.word,
              key: index,
              label: <StringValueComponent stringValue={{ value: x.word }} />,
            }))
        }
      >
        <Input.Search
          loading={isLoadingIfQuery}
          value={query}
          onChange={debounce(onSearch, 400)}
          enterButton={false}
          allowClear
        />
      </AutoComplete>
      <SearchResults
        queryResult={searchResult?.query}
        loading={isLoadingIfQuery}
        query={query}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
