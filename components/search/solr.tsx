import { StringValueComponent } from '@/entity/components/values/string';
import { useSearchQueryParams } from '@/hooks/search-query-params-provider';
import { useSWR } from '@/lib/swr';
import { QueryResult, SearchResult, SuggestionsResult } from '@/types/search';
import { AutoComplete, Input, InputRef } from 'antd';
import { debounce } from 'lodash';
import {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { SearchResults } from './results-list';

export interface SolrQueryFetcherOptions {
  query: string;
}

interface SolrSearchProps {
  placeholder?: string;
  onCloseDrawer?: () => void;
}

export const SolrSearch: React.FC<SolrSearchProps> = ({
  placeholder,
  onCloseDrawer,
}) => {
  const {
    searchQuery: query,
    setSearchQuery: setQuery,
    page: currentPage,
    setPage: setCurrentPage,
  } = useSearchQueryParams();
  const inputRef = useRef<InputRef>(null);

  // query solr logic
  const [urlQuery, setUrlQuery] = useState<string>();

  const { data: queryResult, loading: queryLoading } = useSWR<QueryResult>(
    urlQuery,
    true
  );

  const isLoadingSearchIfQuery =
    urlQuery && !(query && !queryLoading) && !!query && queryLoading;

  // suggest solr logic
  const [urlSuggest, setUrlSuggest] = useState<string>();

  const { data: suggestionsResult, loading: suggetionsLoading } =
    useSWR<SuggestionsResult>(urlSuggest, true);

  const isLoadingSuggestionsIfQuery =
    urlSuggest &&
    !(query && !suggetionsLoading) &&
    !!query &&
    suggetionsLoading;

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value || '');
    setCurrentPage(1);
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current!.focus({
        cursor: 'end',
      });
    }, 200);
  }, []);

  useEffect(() => {
    if (query) {
      if (query.length > 1) {
        const pageSize = 10;
        setUrlQuery(
          `/api/entities/search/query?query=${query}${
            '&start=' + String((currentPage - 1) * pageSize)
          }`
        );

        setUrlSuggest(`/api/entities/search/suggest?query=${query}`);
      } else {
        setUrlQuery(undefined);
        setUrlSuggest(undefined);
      }
    }
  }, [query, currentPage]);

  return (
    <div>
      <AutoComplete
        style={{ width: '100%' }}
        autoFocus
        onSelect={(value: string) =>
          setQuery(value.replaceAll(/(<([^>]+)>)/g, ''))
        }
        defaultValue={query}
        options={
          query &&
          suggestionsResult?.spellcheck.suggestions[1] &&
          suggestionsResult.spellcheck.suggestions[1].suggestion
            .sort((s1, s2) => s2.freq - s1.freq)
            .map((x, index) => ({
              value: x.word,
              key: index,
              label: <StringValueComponent stringValue={{ value: x.word }} />,
            }))
        }
      >
        <Input.Search
          placeholder={placeholder || ''}
          loading={isLoadingSuggestionsIfQuery}
          ref={inputRef}
          autoFocus
          enterButton
          defaultValue={query}
          value={query}
          onChange={debounce(onSearch, 400)}
          allowClear
        />
      </AutoComplete>
      <SearchResults
        queryResult={queryResult}
        loading={isLoadingSearchIfQuery}
        query={query}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onCloseDrawer={onCloseDrawer}
      />
    </div>
  );
};
