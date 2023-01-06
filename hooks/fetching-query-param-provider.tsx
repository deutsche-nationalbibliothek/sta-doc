import { createContext, useContext, useEffect } from 'react';
import { useQueryParam } from 'use-query-params';

declare global {
  interface Window {
    data?: (fetchingParam: FetchingParam) => void;
  }
}

export enum FetchingParam {
  prod = 'prod',
  test = 'test',
}

type FetchingQueryParamContext = {
  fetchingQueryParamString: string
  fetchingQueryParam: Record<'live', FetchingParam>
};

type SetterFunc<T> = ReturnType<typeof useQueryParam<T>>[1];

// param is only used for typing context
const FetchingQueryParamContext = createContext(
  {} as FetchingQueryParamContext
);

export default function FetchingQueryParamProvider({ children }) {
  const [live, setLive] = useQueryParam('live') as [
    FetchingParam | undefined,
    SetterFunc<FetchingParam | undefined>
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!('data' in window)) {
        window.data = (fetchingParam?: FetchingParam) => setLive(fetchingParam);
      }
    }
  }, []);

  const fetchingQueryParamString = live
    ? `?${new URLSearchParams({ live }).toString()}`
    : '';

  const fetchingQueryParam = live ? {live} : {}

  return (
    <FetchingQueryParamContext.Provider value={{fetchingQueryParamString, fetchingQueryParam}}>
      {children}
    </FetchingQueryParamContext.Provider>
  );
}

export const useFetchingQueryParam = () =>
  useContext(FetchingQueryParamContext);
