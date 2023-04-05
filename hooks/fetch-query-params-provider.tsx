import { createContext, useContext, useEffect, useMemo } from 'react';
import { useQueryParam } from 'use-query-params';

declare global {
  interface Window {
    data?: (fetchingParam: FetchingParam) => void;
  }
}

type UseQueryParamSetter<T> = ReturnType<typeof useQueryParam<T>>[1];

export enum FetchingParam {
  prod = 'prod',
  test = 'test',
}

interface RouterQuery {
  live: FetchingParam;
}

type FetchingQueryParamsContext = {
  // string with param set
  fetchingQueryParamsString: string;
  query: RouterQuery;
};

export type QueryParam = string;

// param is only used for typing context
const FetchingQueryParamsContext = createContext(
  {} as FetchingQueryParamsContext
);

export default function FetchingQueryParamsProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [live, setLive] = useQueryParam('live') as [
    FetchingParam | undefined,
    UseQueryParamSetter<FetchingParam | undefined>
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!('data' in window)) {
        window.data = (fetchingParam?: FetchingParam) => setLive(fetchingParam);
      }
    }
  }, [setLive]);

  const fetchingQueryParamsString = live
    ? `?${new URLSearchParams({ live }).toString()}`
    : '';

  const query = useMemo(() => {
    const query = {} as RouterQuery;
    if (live) {
      query.live = live;
    }
    return query;
  }, [live]);

  return (
    <FetchingQueryParamsContext.Provider
      value={{
        fetchingQueryParamsString,
        query,
      }}
    >
      {children}
    </FetchingQueryParamsContext.Provider>
  );
}

export const useFetchingQueryParams = () =>
  useContext(FetchingQueryParamsContext);
