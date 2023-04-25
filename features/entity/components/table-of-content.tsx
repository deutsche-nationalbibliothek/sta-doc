import { useHeadlines } from '@/hooks/headlines';
import { useScroll } from '@/hooks/use-scroll';
import { useRouter } from '@/lib/next-use-router';
import { Headline } from '@/types/headline';
import { Tree, TreeProps, Typography, theme } from 'antd';
import { DataNode } from 'antd/lib/tree';
import RcTree from 'rc-tree';
import React, { memo, useEffect, useState } from 'react';
import layoutSizes from '../../../config/layout-sizes';

interface TableOfContentProps {
  headlines: Headline[];
}

export const TableOfContent: React.FC<TableOfContentProps> = memo(
  ({ headlines }) => {
    const { nestedHeadlines, currentHeadlinesPath, headlineKeysInViewport } =
      useHeadlines();

    const { expandedKeys, onExpand } = useExpandedKeys(headlines);

    const router = useRouter();

    const treeRef = React.useRef<RcTree<DataNode>>(null);
    useScroll(treeRef);

    const treeHeight =
      layoutSizes['topbar-height'] +
      layoutSizes['breadcrumb-height'] +
      layoutSizes['divider-top-height'] +
      layoutSizes['divider-bottom-height'] +
      layoutSizes['footer-height'];

    const { token } = theme.useToken();

    return (
      <Tree
        css={{
          background: 'var(--light-gray)',
          '& .ant-tree-node-selected': {
            backgroundColor: `${token.colorPrimaryBgHover} !important`,
          },
        }}
        showLine
        showIcon
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        ref={treeRef}
        height={window.innerHeight - treeHeight}
        selectedKeys={headlineKeysInViewport}
        multiple
        titleRender={({ key, title }: { key: string; title: string }) => (
          <Typography.Text
            id={`nav-${key}`}
            onClick={() => {
              router.push(undefined, key).catch((e) => console.error(e));
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
    );
  }
);

const useExpandedKeys = (headlines: Headline[]) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>();

  useEffect(() => {
    setExpandedKeys(headlines.map((headline) => headline.key));
  }, [headlines]);

  const onExpand: TreeProps['onExpand'] = (keys: string[]) =>
    setExpandedKeys(keys);

  return { expandedKeys, onExpand };
};
