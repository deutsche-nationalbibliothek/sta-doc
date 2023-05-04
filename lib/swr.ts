import { useFetchingQueryParams } from '@/hooks/fetch-query-params-provider';
import useSWRLib from 'swr';

export const useSWR = <T>(
  url?: string,
  ignoreFetchingQueryParamString = false
): ReturnType<typeof useSWRLib> & { loading: boolean; data?: T } => {
  const { fetchingQueryParamsString } = useFetchingQueryParams();
  const swr = useSWRLib<T>(
    url && [url, fetchingQueryParamsString],
    (apiUrl: string[]) => {
      return fetch(
        apiUrl[0] +
          (ignoreFetchingQueryParamString ? '' : fetchingQueryParamsString)
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
