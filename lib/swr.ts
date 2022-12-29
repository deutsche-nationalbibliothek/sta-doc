import { useFetchingQueryParam } from '@/hooks/fetching-query-param-provider';
import useSWRLib from 'swr';

export const useSWR = <T>(url: string) => {
  const fetchingQueryParam = useFetchingQueryParam()
  const swr = useSWRLib<T>(
    [url,fetchingQueryParam],
    (apiUrl: string) => fetch(apiUrl + fetchingQueryParam).then((res) => res.json()),
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
