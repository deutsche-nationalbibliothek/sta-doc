import { useFetchingQueryParams } from '@/hooks/fetch-query-params-provider';
import useSWRLib from 'swr';

export const useSWR = <T>(
  url?: string,
  ignoreFetchingQueryParamString?: boolean
): ReturnType<typeof useSWRLib> & { loading: boolean; data?: T } => {
  const { fetchingLiveParamsString, fetchingLocaleParamsString } = useFetchingQueryParams();
  const swr = useSWRLib<T>(
    url && [url, fetchingLiveParamsString, fetchingLocaleParamsString],
    (apiUrl: string[]) => {
      return fetch(
        apiUrl[0] +
          (ignoreFetchingQueryParamString ? '' : '?' + fetchingLiveParamsString) +
          (fetchingLiveParamsString && fetchingLocaleParamsString ? '&' : '') +
          (ignoreFetchingQueryParamString ? '?' : '' + fetchingLocaleParamsString ? fetchingLocaleParamsString : '')
      ).then((res) => res.json());
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    ...swr,
    loading: !swr.error && !swr.data,
  };
};
