import { useRouter } from '@/lib/next-use-router';
import { useEffect } from 'react';

export const useInitialScroll = (shouldDo: boolean) => {
  console.log('use initial scroll')
  const router = useRouter();
  useEffect(() => {
    const { hash } = window.location;
    if (hash && shouldDo) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
};
