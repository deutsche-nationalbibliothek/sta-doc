import { useEffect, useState } from 'react';
import { useIsLoading } from './use-loading-state';
import { useRouter } from '@/lib/next-use-router';

export const useInitialScroll = (condition = true) => {
  const { query, anchorId } = useRouter();
  const [hasScrolled, setHasScrolled] = useState(false);

  const { isLoading } = useIsLoading();

  useEffect(() => {
    setHasScrolled(false);
  }, [query.staNotationLabel]);

  useEffect(() => {
    if (condition && !isLoading && !hasScrolled && !anchorId) {
      document
        .getElementById('main-scroll-container')
        ?.scroll({ left: 0, top: 0, behavior: 'smooth' });
      setHasScrolled(true);
    }
  }, [condition, isLoading, anchorId, hasScrolled]);
};
