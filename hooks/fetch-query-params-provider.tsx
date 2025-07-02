import { useRouter } from 'next/router';
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
  live = 'live',
}

interface RouterQuery {
  live: FetchingParam;
  locale: string;
}

type FetchingQueryParamsContext = {
  // string with param set
  fetchingLiveParamsString: string;
  fetchingLocaleParamsString: string;
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
    UseQueryParamSetter<FetchingParam | undefined>,
  ];
  const locale = useRouter().locale;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!('data' in window)) {
        window.data = (fetchingParam?: FetchingParam) => setLive(fetchingParam);
      }
    }
  }, [setLive]);

  const fetchingLiveParamsString = live
    ? `${new URLSearchParams({ live }).toString()}`
    : '';

  const fetchingLocaleParamsString = locale
    ? `${new URLSearchParams({ locale }).toString()}`
    : '';


  const query = useMemo(() => {
    const query = {} as RouterQuery;
    if (live) {
      query.live = live;
    }
    // if (locale) {
    //   query.locale = locale;
    // }
    return query;
  }, [live]);

  return (
    <FetchingQueryParamsContext.Provider
      value={{
        fetchingLiveParamsString,
        fetchingLocaleParamsString,
        query
      }}
    >
      {children}
    </FetchingQueryParamsContext.Provider>
  );
}

export const useFetchingQueryParams = () =>
  useContext(FetchingQueryParamsContext);
