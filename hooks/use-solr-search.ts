import { useSearchQueryParams } from '@/hooks/search-query-params-provider';
import { useSWR } from '@/lib/swr';
import { QueryResult, SuggestionsResult } from '@/types/search';
import { InputRef } from 'antd';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

export const useSolrSearch = () => {
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
      inputRef.current?.focus({
        cursor: 'end',
      });
    }, 200);
  }, []);

  useEffect(() => {
    if (query) {
      if (query.length > 1) {
        const pageSize = 10;
        setUrlQuery(
          `${process.env.basePath}/api/entities/search/query?query=${query}${
            '&start=' + String((currentPage - 1) * pageSize)
          }`
        );

        setUrlSuggest(`${process.env.basePath}/api/entities/search/suggest?query=${query}`);
      } else {
        setUrlQuery(undefined);
        setUrlSuggest(undefined);
      }
    }
  }, [query, currentPage]);

  return {
    suggestionsResult,
    queryResult,
    inputRef,
    isLoadingSearchIfQuery,
    isLoadingSuggestionsIfQuery,
    setQuery,
    query,
    onSearch,
    currentPage,
    setCurrentPage,
  };
};
