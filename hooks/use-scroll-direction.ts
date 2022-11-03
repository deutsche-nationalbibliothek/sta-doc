import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

export const useScrollDirection = (): 'up' | 'down' => {
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

  return scrollPosition.current < scrollPosition.prev ? 'up' : 'down';
};
