import { Headline } from '@/utils/entity-headlines';
import { nestedHeadlines } from '@/utils/nested-headlines';
import { Affix, Divider, Tree } from 'antd';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export const ContentNavigation: React.FC<{ headlines: Headline[] }> = ({
  headlines,
}) => {
  const router = useRouter();
  const [checkedHeadlines, setCheckedHeadlines] = useState([]);
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
    setCheckedHeadlines(headlinesInViewport);
  };

  const debouncedOnScroll = debounce(onScroll, 50);
  useEffect(onScroll, [headlines]);
  useEffect(() => {
    window.addEventListener('scroll', debouncedOnScroll);
    return () => window.removeEventListener('scroll', debouncedOnScroll);
  }, []);

  useEffect(() => {
    const treeContainer: HTMLElement = document.querySelector('div[role=tree]');
    const selectedNodes = Array.from(
      document.getElementsByClassName('ant-tree-node-selected')
    );
    const scrollContainer = document.querySelector('div[id=scrollcontainer]');
    const headingsOutOfViewport = selectedNodes.filter(
      (treeNode: HTMLElement) => !isInViewport(treeNode, treeContainer)
    );
    if (headingsOutOfViewport.length) {
      if (scrollContainer) {
        headingsOutOfViewport.forEach((headingEl) =>
          headingEl.scrollIntoView({
            block: 'center',
            inline: 'nearest',
          })
        );
      }
    }
  }, [checkedHeadlines]);

  return (
    <>
      {treeStructuredHeadlines.length > 0 && (
        <Affix>
          <div
            id="scrollcontainer"
            style={{
              overflowY: 'scroll',
              height: window.innerHeight * 0.9,
            }}
          >
            <Divider />
            <Tree
              showLine
              showIcon
              defaultExpandAll
              // style={{ height: '100%' }}
              selectedKeys={checkedHeadlines}
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
