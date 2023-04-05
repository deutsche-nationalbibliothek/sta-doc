import { TableOfContent } from '@/features/entity/components/table-of-content';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { Divider, Layout } from 'antd';
import React from 'react';

export const Sidebar: React.FC = () => {
  const { headlines } = useInitialHeadlines();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dividerRef = React.useRef<HTMLDivElement>(null);

  return headlines && headlines.length > 1 ? (
    <Layout.Sider theme={'light'} width={'100%'} style={{ height: '100%' }}>
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
        <TableOfContent
          headlines={headlines}
          containerRef={containerRef}
          dividerRef={dividerRef}
        />
        <Divider
          style={{
            marginTop: 'var(--topbar-padding-y)',
            marginBottom: 'var(--topbar-padding-y)',
          }}
        />
      </div>
    </Layout.Sider>
  ) : null;
};
