import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useInitialScroll = () => {
  useEffect(() => {
    const router = useRouter();
    const { pathname, hash } = window.location;
    if (pathname && hash) {
      // kinda hack which works pretty good,
      // more reliable than looking for element and call scrollIntoView()
      router.push(pathname).then(router.back);
    }
  }, []);
};
