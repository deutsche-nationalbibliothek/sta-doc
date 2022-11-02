import { useCurrentHeadlinesPath } from '@/hooks/current-headline-path';
import { Headline } from '@/utils/entity-headlines';
import { NestedHeadline, nestedHeadlines } from '@/utils/nested-headlines';
import { Affix, Divider, Tree } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export const ContentNavigation: React.FC<{ headlines: Headline[] }> = ({
  headlines,
}) => {
  const router = useRouter();
  const [selectedHeadlines, setSelectedHeadlines] = useState([]);
  const {setCurrentHeadlinesPath} =useCurrentHeadlinesPath()
  const treeRef = React.useRef<any>();

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
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || container.clientHeight) &&
      rect.right <= (window.innerWidth || container.clientWidth)
    );
  };

  const onScroll = () => {
    const headlinesInViewport = headlines
      .filter((headline) => {
        return isInViewport(document.getElementById(headline.id));
      })
      .map((headline) => headline.id);
    setSelectedHeadlines(headlinesInViewport);
  };

  const debouncedOnScroll = debounce(onScroll, 50);
  useEffect(onScroll, [headlines]);
  useEffect(() => {
    window.addEventListener('scroll', debouncedOnScroll);
    return () => window.removeEventListener('scroll', debouncedOnScroll);
  }, []);

  useEffect(() => {
    if (treeRef && treeRef.current) {
      const treeContainer: HTMLElement =
        document.querySelector('div[role=tree]');
      const selectedKeys: string[] = treeRef.current.state.selectedKeys;

      const headingsOutOfViewport = selectedKeys.filter(
        (key) =>
          !isInViewport(document.getElementById(`nav-${key}`), treeContainer)
      );
      if (headingsOutOfViewport.length) {
        headingsOutOfViewport.forEach((key) =>
          treeRef.current.scrollTo({ key, offset: 50 })
        );
      }
    }
  }, [selectedHeadlines]);

  useEffect(()=>{
    const firstSelectedHeadlineKey = selectedHeadlines[0]
    if (firstSelectedHeadlineKey) {

    const treeNodeFinder = (headline: NestedHeadline) => {
      if (headline.key === firstSelectedHeadlineKey) {
        return headline
      } else if (headline.children) {
        return headline.children.find(treeNodeFinder)
      }
    }

    const treeNodeReducer = (acc: NestedHeadline[],headline: NestedHeadline) => {
      const {children, ...headlineValues} = headline
      if (headlineValues.key === firstSelectedHeadlineKey) {
        return [...acc, headlineValues]
      } else if (headline.children && headline.children.find(treeNodeFinder)) {
        return headline.children.reduce(treeNodeReducer, [...acc, headlineValues])
      } else {
        return acc
      }
    }
    setCurrentHeadlinesPath(treeStructuredHeadlines.reduce(treeNodeReducer, []))
    }
  }, [selectedHeadlines[0]])

  return (
    <>
      {treeStructuredHeadlines.length > 0 && (
        <Affix>
          <div>
            <Divider />
            <Tree
              showLine
              showIcon
              defaultExpandAll
              ref={treeRef}
              height={window.innerHeight * 0.9}
              selectedKeys={selectedHeadlines}
              multiple
              titleRender={({ key, title }: { key: string; title: string }) => (
                <span id={`nav-${key}`} onClick={() => router.push(`#${key}`)}>
                  {title}
                </span>
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
