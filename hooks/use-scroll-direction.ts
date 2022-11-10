import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

export enum ScrollDirection {
  up = 'up',
  down = 'down',
}

export const useScrollDirection = (): ScrollDirection => {
  const [scrollPosition, setScrollPosition] = useState({
    current: window.scrollY,
    prev: 0,
  });

  const onScroll = () =>
    setScrollPosition((currentScrollPosition) =>
      currentScrollPosition.current === window.scrollY
        ? currentScrollPosition
        : { current: window.scrollY, prev: currentScrollPosition.current }
    );

  const debouncedOnScroll = debounce(onScroll, 30);
  useEffect(() => {
    window.addEventListener('scroll', debouncedOnScroll);
    return () => window.removeEventListener('scroll', debouncedOnScroll);
  }, []);

  return scrollPosition.current < scrollPosition.prev
    ? ScrollDirection.up
    : ScrollDirection.down;
};
