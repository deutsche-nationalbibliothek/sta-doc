import { useRouter } from '@/lib/next-use-router';
import { useEffect } from 'react';

export const useInitialScroll = (shouldDoAnchorScrolling: boolean) => {
  useInitialScrollToAnchor(shouldDoAnchorScrolling);
  useInitialScrollToTop();
};

const useInitialScrollToAnchor = (shouldDo: boolean) => {
  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      if (shouldDo) {
        try {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [shouldDo]);
};

const useInitialScrollToTop = () => {
  const { hash } = window.location;
  const router = useRouter();
  useEffect(() => {
    if (!hash) {
      const scrollToTop = () =>
        document
          .getElementById('main-scroll-container')
          ?.scroll({ left: 0, top: 0, behavior: 'smooth' });
      // document.getElementById('main-scroll-container')?.scroll(0, 0);

      router.events.on('routeChangeComplete', scrollToTop);

      return () => {
        router.events.off('routeChangeComplete', scrollToTop);
      };
    }
  }, [hash, router.events]);
};
