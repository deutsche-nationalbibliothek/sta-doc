import { NestedHeadlines } from '@/types/headline';
import { isInViewport } from '@/utils/is-in-viewport';
import { DataNode } from 'antd/lib/tree';
import { debounce } from 'lodash';
import RcTree from 'rc-tree';
import { useCallback, useEffect } from 'react';
import { useHeadlines } from './headlines';
import { useInitialHeadlines } from './initial-headlines';

export const useScroll = (
  treeRef: React.MutableRefObject<RcTree<DataNode> | null>
) => {
  const { headlines } = useInitialHeadlines();
  const {
    nestedHeadlines,
    setCurrentHeadlinesPath,
    headlineKeysInViewport,
    setHeadlineKeysInViewport,
  } = useHeadlines();

  const onScroll = useCallback(() => {
    const headlinesInViewport: string[] = (headlines ?? [])
      .filter((headline) => {
        const headlineElement = document.getElementById(headline.key);
        const scrollContainerElement = document.getElementById(
          'main-scroll-container'
        );
        return (
          headlineElement &&
          scrollContainerElement &&
          isInViewport(headlineElement, scrollContainerElement)
        );
      })
      .map((headline) => headline.key);

    setHeadlineKeysInViewport((currentSelectedHeadlines) => {
      if (headlinesInViewport.length) {
        if (
          currentSelectedHeadlines.length === headlinesInViewport.length &&
          currentSelectedHeadlines.every(
            (currentSelectedHeadline, index) =>
              currentSelectedHeadline === headlinesInViewport[index]
          )
        ) {
          // return same identiy to prevent effect triggers
          return currentSelectedHeadlines;
        } else {
          return headlinesInViewport;
        }
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
  }, [setHeadlineKeysInViewport, headlines]);

  const debouncedOnScroll = debounce(onScroll, 50);
  const useDebouncedOnScroll = useCallback(debouncedOnScroll, [
    debouncedOnScroll,
  ]);

  useEffect(useDebouncedOnScroll, [useDebouncedOnScroll]);

  useEffect(() => {
    const scrollContainerElement = document.getElementById(
      'main-scroll-container'
    );
    scrollContainerElement?.addEventListener('scroll', debouncedOnScroll);
    return () =>
      scrollContainerElement?.removeEventListener('scroll', debouncedOnScroll);
  }, [debouncedOnScroll]);

  useEffect(() => {
    headlineKeysInViewport.forEach((headlineKey) => {
      treeRef.current?.scrollTo({
        key: headlineKey,
        align: 'auto',
        offset: 80,
      });
    });
  }, [headlineKeysInViewport, treeRef]);

  useEffect(() => {
    const firstSelectedHeadlineKey =
      headlineKeysInViewport.length && headlineKeysInViewport[0];
    if (firstSelectedHeadlineKey) {
      const treeNodeFinder = (
        headline: NestedHeadlines
      ): NestedHeadlines | undefined => {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  }, [setCurrentHeadlinesPath, headlineKeysInViewport, nestedHeadlines]);
};
