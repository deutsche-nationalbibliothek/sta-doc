import { useHeadlines } from '@/hooks/headlines';
import { useScroll } from '@/hooks/use-scroll';
import { Affix, Divider, Tree, Typography } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { useRouter } from 'next/router';
import RcTree from 'rc-tree';
import React from 'react';

export const ContentNavigation: React.FC = () => {
  const { nestedHeadlines, currentHeadlinesPath, headlineKeysInViewport } =
    useHeadlines();
  const router = useRouter();
  const treeRef = React.useRef<RcTree<DataNode>>();
  useScroll(treeRef);

  return (
    <>
      {nestedHeadlines.length > 0 && (
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
            <Divider />
          </div>
        </Affix>
      )}
    </>
  );
};
