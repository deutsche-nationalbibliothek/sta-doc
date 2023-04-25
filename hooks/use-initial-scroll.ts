import { useEffect } from 'react';

export const useInitialScroll = (shouldDoAnchorScrolling: boolean) => {
  useInitialScrollToAnchor(shouldDoAnchorScrolling);
  // useInitialScrollToTop();
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
  useEffect(() => {
    if (!hash) {
      document
        .getElementById('main-scroll-container')
        ?.scroll({ left: 0, top: 0, behavior: 'smooth' });
    }
  }, [hash]);
};
