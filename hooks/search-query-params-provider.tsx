import { createContext, useContext, useMemo } from 'react';
import { NumberParam, StringParam, useQueryParam } from 'use-query-params';

type UseQueryParamSetter<T> = ReturnType<typeof useQueryParam<T>>[1];

interface RouterQuery {
  // query
  q: string;
  // page
  p: number;
}

type SearchQueryParamsContext = {
  query: RouterQuery;
  searchQuery: string;
  setSearchQuery: UseQueryParamSetter<string>;
  page: number;
  setPage: UseQueryParamSetter<number>;
  searchQueryParamsString: string;
};

export type QueryParam = string;

// param is only used for typing context
const SearchQueryParamsContext = createContext({} as SearchQueryParamsContext);

export default function SearchQueryParamsProvider({
  children,
}: PropsWithChildren) {
  const [searchQuery, setSearchQuery] = useQueryParam(
    'q',
    { ...StringParam, default: '' },
    { removeDefaultsFromUrl: true }
  );

  const [page, setPage] = useQueryParam(
    'p',
    { ...NumberParam, default: 1 },
    { removeDefaultsFromUrl: true }
  );

  const searchParams: { searchPage?: string; query?: string } = {};
  if (page && page !== 1) {
    searchParams.searchPage = String(page);
  }
  if (searchQuery) {
    searchParams.query = searchQuery;
  }
  const searchQueryParamsString = new URLSearchParams(searchParams).toString();

  const query = useMemo(() => {
    const query = {} as RouterQuery;
    if (page && page !== 1) {
      query.p = page;
    }
    if (searchQuery) {
      query.q = searchQuery;
    }
    return query;
  }, [page, searchQuery]);

  return (
    <SearchQueryParamsContext.Provider
      value={{
        page: page || 1,
        query,
        setPage,
        searchQuery: searchQuery || '',
        setSearchQuery,
        searchQueryParamsString,
      }}
    >
      {children}
    </SearchQueryParamsContext.Provider>
  );
}

export const useSearchQueryParams = () => useContext(SearchQueryParamsContext);
