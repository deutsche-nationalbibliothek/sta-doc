import { useCurrentHeadlinesPath } from '@/hooks/current-headline-path';
import { useScrollDirection } from '@/hooks/use-scroll-direction';
import { Headline } from '@/utils/entity-headlines';
import { NestedHeadline, nestedHeadlines } from '@/utils/nested-headlines';
import { Affix, Divider, Tree, Typography } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import RcTree from 'rc-tree';
import React, { useCallback, useEffect, useState } from 'react';

export const ContentNavigation: React.FC<{ headlines: Headline[] }> = ({
  headlines,
}) => {
  const router = useRouter();
  const [selectedHeadlines, setSelectedHeadlines] = useState<string[]>([]);
  const { setCurrentHeadlinesPath, currentHeadlinesPath } =
    useCurrentHeadlinesPath();
  // const treeRef = React.useRef<{state: {selectedKeys: string[]}, scrollTo: (options: {key: string, offset: number}) => void}>();
  const treeRef = React.useRef<RcTree<DataNode>>();

  const scrollDirection = useScrollDirection();

  const { headlines: treeStructuredHeadlines } = nestedHeadlines(headlines);

  const isInViewport = (
    element: HTMLElement,
    container = document.documentElement
  ) => {
    if (!element) {
      return false;
    }
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= -60 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || container.clientHeight) &&
      rect.right <= (window.innerWidth || container.clientWidth)
    );
  };

  const onScroll = useCallback(() => {
    const headlinesInViewport: string[] = headlines
      .filter((headline) => {
        return isInViewport(document.getElementById(headline.id));
      })
      .map((headline) => headline.id);

    setSelectedHeadlines((currentSelectedHeadlines) => {
      if (headlinesInViewport.length) {
        return headlinesInViewport;
      } else {
        // todo, logic breaks if scrolling up and no headline is in viewport
        const currentLastHeadline =
          currentSelectedHeadlines[currentSelectedHeadlines.length - 1];
        return [currentLastHeadline];
      }
    });
  }, [setSelectedHeadlines, headlines, scrollDirection]);

  const debouncedOnScroll = useCallback(debounce(onScroll, 50), [onScroll]);
  useEffect(onScroll, [headlines]);
  useEffect(() => {
    window.addEventListener('scroll', debouncedOnScroll);
    return () => window.removeEventListener('scroll', debouncedOnScroll);
  }, [debouncedOnScroll]);

  useEffect(() => {
    if (treeRef && treeRef.current) {
      const treeContainer: HTMLElement =
        document.querySelector('div[role=tree]');
      const selectedKeys = treeRef.current.state.selectedKeys;

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
  }, [selectedHeadlines, scrollDirection]);

  useEffect(() => {
    const firstSelectedHeadlineKey = selectedHeadlines[0];
    if (firstSelectedHeadlineKey) {
      const treeNodeFinder = (headline: NestedHeadline) => {
        if (headline.key === firstSelectedHeadlineKey) {
          return headline;
        } else if (headline.children) {
          return headline.children.find(treeNodeFinder);
        }
      };

      const treeNodeReducer = (
        acc: NestedHeadline[],
        headline: NestedHeadline
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
      setCurrentHeadlinesPath(
        treeStructuredHeadlines.reduce(treeNodeReducer, [])
      );
    }
  }, [selectedHeadlines[0]]);

  return (
    <>
      {treeStructuredHeadlines.length > 0 && (
        <Affix offsetTop={64 /* topbar-height */}>
          <div>
            <Divider
              style={{
                marginTop: 'var(--topbar-padding-bottom)',
                marginBottom: 'var(--topbar-padding-bottom)',
              }}
            />
            <Tree
              showLine
              showIcon
              defaultExpandAll
              ref={treeRef}
              height={
                window.innerHeight - 64 - 48 * 2 // topbar- and divider-height
              }
              selectedKeys={selectedHeadlines}
              multiple
              titleRender={({ key, title }: { key: string; title: string }) => (
                <Typography.Text
                  id={`nav-${key}`}
                  onClick={() => router.push(`#${key}`)}
                  strong={
                    currentHeadlinesPath.findIndex(
                      (nestedHeadline) => nestedHeadline.key === key
                    ) >= 0
                  }
                >
                  {title}
                </Typography.Text>
              )}
              treeData={treeStructuredHeadlines}
            />
            <Divider />
          </div>
        </Affix>
      )}
    </>
  );
};
