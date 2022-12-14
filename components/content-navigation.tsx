import { useHeadlines } from '@/hooks/headlines';
import { useScroll } from '@/hooks/use-scroll';
import { useRouter } from '@/lib/next-use-router';
import { Divider, Tree, Typography } from 'antd';
import { DataNode } from 'antd/lib/tree';
import RcTree from 'rc-tree';
import React from 'react';

export const ContentNavigation: React.FC = () => {
  const { nestedHeadlines, currentHeadlinesPath, headlineKeysInViewport } =
    useHeadlines();

  const router = useRouter();
  const treeRef = React.useRef<RcTree<DataNode>>();
  const containerRef = React.useRef<HTMLDivElement>();
  const dividerRef = React.useRef<HTMLDivElement>();
  useScroll(treeRef);

  const containerHeight = containerRef.current?.getBoundingClientRect().height;
  const dividerHeight = dividerRef.current?.getBoundingClientRect().height;
  // const headerHeight = document ? document.querySelector('.ant-layout-header').getBoundingClientRect().height : 64

  return (
    <>
      {nestedHeadlines.length > 0 && (
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            // height: 'calc(100vh - var(--topbar-height))',
          }}
        >
          <div ref={dividerRef}>
            <Divider
              style={{
                marginTop: 'var(--topbar-padding-y)',
                marginBottom: 'var(--topbar-padding-y)',
              }}
            />
          </div>
          <Tree
            showLine
            showIcon
            defaultExpandAll
            ref={treeRef}
            height={
              containerHeight - dividerHeight * 2
              // document ? document.querySelector('.tile').getBoundingClientRect().height - dividerHeight * 2 - 20 : containerHeight - dividerHeight * 2
              // window.innerHeight - 64 - 53 * 2 // topbar- and divider-height
            }
            selectedKeys={headlineKeysInViewport}
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
            treeData={nestedHeadlines}
          />
          <Divider
            style={{
              marginTop: 'var(--topbar-padding-y)',
              marginBottom: 'var(--topbar-padding-y)',
            }}
          />
        </div>
      )}
    </>
  );
};
