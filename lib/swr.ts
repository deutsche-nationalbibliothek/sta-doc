import useSWRLib from 'swr';

export const useSWR = <T>(url: string) => {
  const swr = useSWRLib<T>(
    url,
    (apiUrl: string) => fetch(apiUrl).then((res) => res.json()),
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
