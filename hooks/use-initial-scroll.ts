import { useEffect } from 'react';

export const useInitialScroll = (shouldDo: boolean) => {
  useEffect(() => {
    const { hash } = window.location;
    if (hash && shouldDo) {
      try {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [shouldDo]);
};
