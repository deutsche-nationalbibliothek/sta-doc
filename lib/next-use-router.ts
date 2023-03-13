import { useFetchingQueryParams } from '@/hooks/fetch-query-params-provider';
import { useSearchQueryParams } from '@/hooks/search-query-params-provider';
import { useRouter as useNextRouter } from 'next/router';
import { useCallback } from 'react';

type UseRouter = ReturnType<typeof useNextRouter>;
type useRouterPushParams = Parameters<UseRouter['push']>;
type Url = useRouterPushParams[0];

export const useRouter = (): UseRouter => {
  const router = useNextRouter();

  const { fetchingQueryParamsString } = useFetchingQueryParams();
  const { searchQueryParamsString } = useSearchQueryParams();

  const queryParams = [
    fetchingQueryParamsString,
    searchQueryParamsString,
  ].filter((a) => a);

  const queryParamsString = queryParams.length
    ? `?${queryParams.join('&')}`
    : '';

  const push = useCallback(
    async (url: Url, anchor?: string) => {
      return await router.push(
        `${url.toString()}${queryParamsString}${anchor ? `#${anchor}` : ''}`
      );
    },
    [fetchingQueryParamsString]
  );

  return {
    ...router,
    push,
  };
};
