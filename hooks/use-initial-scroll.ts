import { keepHeadlineAligned, scrollToHeadline } from '@/utils/scroll-to-headline';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useIsLoading } from './use-loading-state';

const appPathname = (pathname: string) => {
  const basePath = process.env.basePath ?? '';
  let path = pathname;
  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length) || '/';
  }
  return path.replace(/^\/fr(?=\/|$)/, '') || '/';
};

const hashFromLocation = () => window.location.hash.replace(/^#/, '');

export const useInitialScroll = (condition = true) => {
  const { query, events } = useRouter();
  const { isLoading } = useIsLoading();
  const pageId = query.staNotationLabel?.toString();
  const scrolledKeyRef = useRef<string>();

  useEffect(() => {
    if (!condition || isLoading) {
      return;
    }

    const anchorId = hashFromLocation();
    const scrollKey = `${pageId ?? ''}:${anchorId}`;

    if (scrolledKeyRef.current === scrollKey) {
      return;
    }

    if (!anchorId) {
      document
        .getElementById('main-scroll-container')
        ?.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      scrolledKeyRef.current = scrollKey;
      return;
    }

    return keepHeadlineAligned(anchorId, {
      onSettled: () => {
        scrolledKeyRef.current = scrollKey;
      },
    });
  }, [condition, isLoading, pageId]);

  useEffect(() => {
    if (!condition) {
      return;
    }

    const scrollToCurrentHash = () => {
      const anchorId = hashFromLocation();
      if (anchorId) {
        scrollToHeadline(anchorId, 'smooth');
      }
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as Element | null)?.closest?.('a');
      if (!link) {
        return;
      }
      const target = link.getAttribute('target');
      if (target && target !== '_self') {
        return;
      }

      const href = link.getAttribute('href');
      if (!href) {
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      const headlineKey = url.hash.replace(/^#/, '');
      if (!headlineKey) {
        return;
      }
      if (appPathname(url.pathname) !== appPathname(window.location.pathname)) {
        return;
      }

      event.preventDefault();

      if (hashFromLocation() === headlineKey) {
        scrollToHeadline(headlineKey, 'smooth');
        return;
      }

      window.location.hash = headlineKey;
    };

    window.addEventListener('hashchange', scrollToCurrentHash);
    document.addEventListener('click', onClick, true);
    events.on('hashChangeComplete', scrollToCurrentHash);

    return () => {
      window.removeEventListener('hashchange', scrollToCurrentHash);
      document.removeEventListener('click', onClick, true);
      events.off('hashChangeComplete', scrollToCurrentHash);
    };
  }, [condition, events]);
};
