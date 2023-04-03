import { createContext, useContext } from 'react';
import { NumberParam, StringParam, useQueryParam } from 'use-query-params';

type UseQueryParamSetter<T> = ReturnType<typeof useQueryParam<T>>[1];

type SearchQueryParamsContext = {
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
    'query',
    { ...StringParam, default: '' },
    { removeDefaultsFromUrl: true }
  );

  const [page, setPage] = useQueryParam(
    'searchPage',
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

  return (
    <SearchQueryParamsContext.Provider
      value={{
        page: page || 1,
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
