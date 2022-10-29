import useSWRLib from 'swr';

export const useSWR = <T>(url: string) => {
  const swr = useSWRLib<T>(url, (...args) =>
    fetch(...args).then((res) => res.json())
  );
  return {
    ...swr,
    loading: !swr.error && !swr.data,
  };
};
