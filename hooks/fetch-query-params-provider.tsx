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
  de = 'de',
  fr = 'fr'
}

interface RouterQuery {
  live: FetchingParam | undefined;
  locale: string;
  query: string | undefined;
}

type FetchingQueryParamsContext = {
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
  // const locale = useRouter().locale;
  const [live, setLive] = useQueryParam('live') as [
    FetchingParam | undefined,
    UseQueryParamSetter<FetchingParam | undefined>,
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!('data' in window)) {
        window.data = (fetchingParam?: FetchingParam) => setLive(fetchingParam);
      }
    }
  }, [setLive]);

  const query = useMemo(() => {
    const queryObj: Partial<RouterQuery> = {};

    if (live) {
      queryObj.live = live;
    }

    return queryObj as RouterQuery;
  }, [live]);

  return (
    <FetchingQueryParamsContext.Provider
      value={{
        query
      }}
    >
      {children}
    </FetchingQueryParamsContext.Provider>
  );
}

export const useFetchingQueryParams = () =>
  useContext(FetchingQueryParamsContext);
