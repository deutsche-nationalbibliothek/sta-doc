import { useFetchingQueryParam } from '@/hooks/fetching-query-param-provider';
import useSWRLib from 'swr';

export const useSWR = <T>(url: string) => {
  const { fetchingQueryParamString } = useFetchingQueryParam();
  const swr = useSWRLib<T>(
    url && [url, fetchingQueryParamString],
    (apiUrl: string) =>
      fetch(apiUrl + fetchingQueryParamString).then((res) => res.json()),
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
