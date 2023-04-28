import { scrollToHeadline } from '@/utils/scroll-to-headline';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useInitialScroll = (condition = true) => {
  const { query, asPath } = useRouter();

  const asPathFragmentRegex = /(?<=#).*/;
  const anchorId = asPath.match(asPathFragmentRegex);

  useEffect(() => {
    if (condition) {
      if (anchorId) {
        scrollToHeadline(anchorId[0]);
      } else {
        document
          .getElementById('main-scroll-container')
          ?.scroll({ left: 0, top: 0, behavior: 'smooth' });
      }
    }
    // anchorId is not a dep!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.staNotationLabel, condition]);
};
