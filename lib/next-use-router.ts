import { useFetchingQueryParam } from '@/hooks/fetching-query-param-provider';
import { useRouter as useNextRouter } from 'next/router';
import { useCallback } from 'react';

type UseRouter = ReturnType<typeof useNextRouter>;
type useRouterPushParams = Parameters<UseRouter['push']>;
type Url = useRouterPushParams[0];

export const useRouter = (): UseRouter => {
  const router = useNextRouter();

  const { fetchingQueryParamString } = useFetchingQueryParam();

  const push = useCallback(
    async (url: Url, fragment?: string) => {
      return await router.push(
        `${url.toString()}${fetchingQueryParamString}${fragment ?? ''}`
      );
    },
    [fetchingQueryParamString]
  );

  return {
    ...router,
    push,
  };
};
