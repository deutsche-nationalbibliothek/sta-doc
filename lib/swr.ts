import { useFetchingQueryParams } from '@/hooks/fetch-query-params-provider';
import { useMemo } from 'react';
import useSWRLib from 'swr';

export const useSWR = <T>(
  url?: string,
  ignoreFetchingQueryParamString?: boolean,
  locale?: string
): ReturnType<typeof useSWRLib> & { loading: boolean; data?: T } => {
  // calling the context
  const { query } = useFetchingQueryParams();
  const apiEntityCall = url?.includes('api')

  // Construct the full URL with query parameters
  const fullUrl = useMemo(() => {
    if (ignoreFetchingQueryParamString) return url;
    if (!url) return url;
    const [path] = url.split('?');
    // Create URLSearchParams from the query object
    const searchParams = new URLSearchParams();
    // Add live parameter if it exists and is not ignored
    if (query.live && !ignoreFetchingQueryParamString) {
      searchParams.append('live', query.live);
    }
    if (apiEntityCall && locale) {
      searchParams.append('locale', locale);
    }
    const search = searchParams.toString();

    return search ? `${path}?${search}` : path;
  }, [apiEntityCall, locale, url, query, ignoreFetchingQueryParamString]);

  const swr = useSWRLib<T>(
    fullUrl,
    async (apiUrl: string) => {
      const res = await fetch(apiUrl);
      const body: unknown = await res.json();
      if (!res.ok) {
        const message =
          body && typeof body === 'object' && 'message' in body
            ? String(body.message)
            : undefined;
        throw new Error(message || `Request failed with ${res.status}`);
      }
      return body as T;
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