import { useFetchingQueryParams } from '@/hooks/fetch-query-params-provider';
import { useSearchQueryParams } from '@/hooks/search-query-params-provider';
import { pickBy } from 'lodash';
import { useRouter as useNextRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

type UseRouter = Omit<ReturnType<typeof useNextRouter>, 'push'> & {
  push: PushFunc;
};

type PushFunc = (
  pathname?: string,
  anchor?: string,
  query?: Record<string, string>
) => Promise<boolean>;

export const useRouter = (): UseRouter => {
  const router = useNextRouter();

  // global query params:
  const { query: fetchingQuery } = useFetchingQueryParams();
  const { query: searchQuery } = useSearchQueryParams();

  const push = useCallback<PushFunc>(
    async (pathname, anchor?, query = {}) => {
      const nextPath = pathname ?? router.pathname;
      return await router.push({
        pathname: nextPath,
        hash: anchor,
        query: {
          ...pickBy(router.query, (_value, key) => nextPath.includes(key)),
          ...searchQuery,
          ...fetchingQuery,
          ...query,
        },
      });
    },
    [searchQuery, fetchingQuery, router]
  );

  return useMemo(
    () => ({
      ...router,
      push,
    }),
    [router, push]
  );
};
