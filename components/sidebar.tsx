import { useHeadlines } from '@/hooks/headlines';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useScroll } from '@/hooks/use-scroll';
import { useRouter } from '@/lib/next-use-router';
import { Divider, Layout, Tree, Typography } from 'antd';
import { DataNode } from 'antd/lib/tree';
import RcTree from 'rc-tree';
import React from 'react';

export const Sidebar: React.FC = () => {
  const { headlines } = useInitialHeadlines();
  const { nestedHeadlines, currentHeadlinesPath, headlineKeysInViewport } =
    useHeadlines();

  const router = useRouter();
  const treeRef = React.useRef<RcTree<DataNode>>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dividerRef = React.useRef<HTMLDivElement>(null);
  useScroll(treeRef);

  const containerHeight =
    containerRef.current?.getBoundingClientRect().height ?? 0;
  const dividerHeight = dividerRef.current?.getBoundingClientRect().height ?? 0;
  // const headerHeight = document ? document.querySelector('.ant-layout-header').getBoundingClientRect().height : 64

  return (
    <>
      {headlines && headlines.length > 1 && (
        <Layout.Sider theme={'light'} width={'100%'} style={{ height: '100%' }}>
          <>
            {nestedHeadlines.length > 0 && (
              <div
                ref={containerRef}
                className="main-layout-height"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
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
                  expandedKeys={headlines.map((headline) => headline.key)}
                  ref={treeRef}
                  height={
                    containerHeight - dividerHeight * 2
                    // document ? document.querySelector('.tile').getBoundingClientRect().height - dividerHeight * 2 - 20 : containerHeight - dividerHeight * 2
                    // window.innerHeight - 64 - 53 * 2 // topbar- and divider-height
                  }
                  selectedKeys={headlineKeysInViewport}
                  multiple
                  titleRender={({
                    key,
                    title,
                  }: {
                    key: string;
                    title: string;
                  }) => (
                    <Typography.Text
                      id={`nav-${key}`}
                      onClick={() => {
                        router
                          .push(`#${key}`, undefined, { shallow: false })
                          .catch((e) => console.error(e));
                      }}
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
        </Layout.Sider>
      )}
    </>
  );
};
