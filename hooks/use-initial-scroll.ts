import { scrollToHeadline } from '@/utils/scroll-to-headline';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIsLoading } from './use-loading-state';

export const useInitialScroll = (condition = true) => {
  const { query, asPath } = useRouter();
  const [hasScrolled, setHasScrolled] = useState(false);

  const asPathFragmentRegex = /(?<=#).*/;
  const anchorId = asPath.match(asPathFragmentRegex);

  const { isLoading } = useIsLoading();

  useEffect(() => {
    setHasScrolled(false);
  }, [query.staNotationLabel]);

  useEffect(() => {
    if (condition && !isLoading && !hasScrolled) {
      if (anchorId) {
        // quickfix race condition, make sure rendering has finished
        setTimeout(() => scrollToHeadline(anchorId[0]), 50);
      } else {
        document
          .getElementById('main-scroll-container')
          ?.scroll({ left: 0, top: 0, behavior: 'smooth' });
      }
      setHasScrolled(true);
    }
  }, [condition, isLoading, anchorId, hasScrolled]);
};
