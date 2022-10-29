import { useHeadlines } from '@/hooks/headlines';
import { nestedHeadlines } from '@/utils/nested-headlines';
import { Divider, Layout, Tree } from 'antd';
import React from 'react';

export const Sidebar: React.FC = () => {
  const { headlines } = nestedHeadlines(useHeadlines().headlines);

  return (
    <Layout.Sider theme={'light'} width={400}>
      {headlines.length > 0 && (
        <>
          <div>
            <Divider />
            <Tree
              showLine
              showIcon
              defaultExpandAll
              // checkable
              height={800}
              treeData={headlines}
            />
            <Divider />
          </div>
        </>
      )}
    </Layout.Sider>
  );
};
