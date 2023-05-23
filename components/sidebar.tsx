import { TableOfContent } from '@/features/entity/components/table-of-content';
import { Layout } from 'antd';
import React from 'react';
import { layoutContentHeight } from './layout';

export const Sidebar: React.FC = () => {
  return (
    <Layout.Sider
      theme={'light'}
      width={'100%'}
      css={{
        height: layoutContentHeight(false),
      }}
    >
      <div
        css={{
          height: layoutContentHeight(false),
          background: 'var(--light-gray)',
        }}
      >
        <TableOfContent />
      </div>
    </Layout.Sider>
  );
};
