import { pickBy } from 'lodash';
import { createContext, useContext, useEffect } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';

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

type FetchingQueryParamsContext = {
  // string with param set
  fetchingQueryParamsString: string;
};

export type QueryParam = string;

// param is only used for typing context
const FetchingQueryParamsContext = createContext(
  {} as FetchingQueryParamsContext
);

export default function FetchingQueryParamsProvider({ children }) {
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
  }, []);

  const fetchingQueryParamsString = live
    ? `?${new URLSearchParams({ live }).toString()}`
    : '';

  return (
    <FetchingQueryParamsContext.Provider
      value={{
        fetchingQueryParamsString,
      }}
    >
      {children}
    </FetchingQueryParamsContext.Provider>
  );
}

export const useFetchingQueryParams = () =>
  useContext(FetchingQueryParamsContext);
