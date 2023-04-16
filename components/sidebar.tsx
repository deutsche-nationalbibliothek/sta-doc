import { TableOfContent } from '@/features/entity/components/table-of-content';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { Layout } from 'antd';
import React from 'react';
import { layoutContentHeight } from './layout';

export const Sidebar: React.FC = () => {
  const { headlines } = useInitialHeadlines();

  return headlines && headlines.length > 1 ? (
    <Layout.Sider
      theme={'light'}
      width={'100%'}
      css={{
        height: layoutContentHeight,
      }}
    >
      <div
        css={{
          height: layoutContentHeight,
          background: 'var(--dark-gray)',
        }}
      >
        <TableOfContent headlines={headlines} />
      </div>
    </Layout.Sider>
  ) : null;
};
