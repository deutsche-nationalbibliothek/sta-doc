import { NestedHeadlines } from '@/types/headline';
import { isInViewport } from '@/utils/is-in-viewport';
import { DataNode } from 'antd/lib/tree';
import { debounce } from 'lodash';
import RcTree from 'rc-tree';
import { useCallback, useEffect, useState } from 'react';
import { useHeadlines } from './headlines';

export const useScroll = (
  treeRef: React.MutableRefObject<RcTree<DataNode>>
) => {
  const {
    headlines,
    nestedHeadlines,
    setCurrentHeadlinesPath,
    headlineKeysInViewport,
    setHeadlineKeysInViewport,
  } = useHeadlines();

  const scrollDirection = useScrollDirection();

  const onScroll = useCallback(() => {
    const headlinesInViewport: string[] = headlines
      .filter((headline) => {
        return isInViewport(document.getElementById(headline.key));
      })
      .map((headline) => headline.key);

    setHeadlineKeysInViewport((currentSelectedHeadlines) => {
      if (headlinesInViewport.length) {
        return headlinesInViewport;
      } else {
        // todo, logic breaks if scrolling up and no headline is in viewport
        const currentLastHeadline =
          currentSelectedHeadlines[currentSelectedHeadlines.length - 1];
        return [currentLastHeadline];
        // todo, need information if scrollDirection === ScrollDirection.up already happened
        // if (scrollDirection === ScrollDirection.down) {
        //   console.log('Fallback down', [currentLastHeadline]);
        //     return [currentLastHeadline];
        // } else if (scrollDirection === ScrollDirection.up) {
        //   console.log('Fallback up');
        //   try {
        //     return [
        //       headlines[
        //         headlines.findIndex(
        //           (headline) => headline.key === currentLastHeadline
        //         ) - 1
        //       ].key,
        //     ];
        //   } catch (error) {
        //     const hs = headlines;
        //     const c = currentLastHeadline;
        //     debugger;
        //   }
        // } else {
        //   return currentSelectedHeadlines;
        // }
      }
    });
  }, [setHeadlineKeysInViewport, headlines, scrollDirection]);

  const debouncedOnScroll = useCallback(debounce(onScroll, 50), [onScroll]);

  useEffect(debouncedOnScroll, [debouncedOnScroll]);

  useEffect(() => {
    window.addEventListener('scroll', debouncedOnScroll);
    return () => window.removeEventListener('scroll', debouncedOnScroll);
  }, [debouncedOnScroll]);

  useEffect(() => {
    if (treeRef && treeRef.current) {
      const treeContainer: HTMLElement =
        document.querySelector('div[role=tree]');
      const selectedKeys = treeRef.current.state.selectedKeys ?? [];

      const headingsOutOfViewport = selectedKeys.filter(
        (key) =>
          !isInViewport(document.getElementById(`nav-${key}`), treeContainer)
      );
      if (headingsOutOfViewport.length) {
        treeRef.current.scrollTo({
          key:
            scrollDirection === 'up'
              ? headingsOutOfViewport[0]
              : headingsOutOfViewport[headingsOutOfViewport.length - 1],
          offset: 80,
        });
      }
    }
  }, [headlineKeysInViewport, scrollDirection]);

  useEffect(() => {
    const firstSelectedHeadlineKey =
      headlineKeysInViewport.length && headlineKeysInViewport[0];
    if (firstSelectedHeadlineKey) {
      const treeNodeFinder = (headline: NestedHeadlines) => {
        if (headline.key === firstSelectedHeadlineKey) {
          return headline;
        } else if (headline.children) {
          return headline.children.find(treeNodeFinder);
        }
      };

      const treeNodeReducer = (
        acc: NestedHeadlines[],
        headline: NestedHeadlines
      ): { title: string; key: string }[] => {
        const { children, ...headlineValues } = headline;
        if (headlineValues.key === firstSelectedHeadlineKey) {
          return [...acc, headlineValues];
        } else if (
          headline.children &&
          headline.children.find(treeNodeFinder)
        ) {
          return headline.children.reduce(treeNodeReducer, [
            ...acc,
            headlineValues,
          ]);
        } else {
          return acc;
        }
      };
      setCurrentHeadlinesPath(nestedHeadlines.reduce(treeNodeReducer, []));
    }
  }, [headlineKeysInViewport]);
};

enum ScrollDirection {
  up = 'up',
  down = 'down',
}

const useScrollDirection = (): ScrollDirection => {
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