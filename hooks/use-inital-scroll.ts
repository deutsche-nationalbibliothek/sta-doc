import { useRouter } from '@/lib/next-use-router';
import { useEffect } from 'react';

export const useInitialScroll = (shouldDo: boolean) => {
  const router = useRouter();
  useEffect(() => {
    const { pathname, hash } = window.location;
    if (pathname && hash && shouldDo) {
      // kinda hack which works pretty good,
      // more reliable than looking for element and call scrollIntoView()
      router.push(pathname).then(router.back);
    }
  }, []);
};
