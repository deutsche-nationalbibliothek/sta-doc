import { Breadcrumb } from '@/entity/components/breadcrumb';
import { useHeadlines } from '@/hooks/headlines';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { Layout as AntdLayout } from 'antd';
import { useEffect, useRef } from 'react';
import { LoadingIndicator } from './loading-indicator';
import { Sidebar } from './sidebar';
import { Splitter } from './splitter';
import { TopBar } from './top-bar';

interface LayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: LayoutProps) {
  const { nestedHeadlines, showHeadlines } = useHeadlines();
  return (
    <AntdLayout>
      <LoadingIndicator />
      <TopBar />
      <AntdLayout
        style={{
          height: 'calc(100vh - var(--topbar-height) - var(--footer-height))',
        }}
      >
        {nestedHeadlines.length && showHeadlines ? (
          <Splitter>
            {nestedHeadlines.length > 0 && <Sidebar />}
            <Content>{props.children}</Content>
          </Splitter>
        ) : (
          <Content>{props.children}</Content>
        )}
      </AntdLayout>
      <AntdLayout.Footer
        style={{
          zIndex: 1,
          padding: '5px 50px',
          height: 'var(--footer-height)',
          textAlign: 'center',
        }}
      >
        Footer
      </AntdLayout.Footer>
    </AntdLayout>
  );
}

const Content: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { headlines } = useInitialHeadlines();
  return (
    <AntdLayout
      style={{
        paddingLeft: headlines.length > 1 ? 26 : '5%',
        paddingRight: headlines.length > 1 ? 26 : '5%',
      }}
    >
      <AntdLayout.Content>
        <Breadcrumb />
        <div
          id="main-scroll-container"
          style={{
            height:
              'calc(100vh - var(--topbar-height) - var(--footer-height) - var(--topbar-padding-y) - 2px)', //window.innerHeight - 64 - 4 , //- 48 * 2, // topbar- and divider-height
            overflowY: 'auto',
            padding: '0px 25px',
          }}
        >
          {children}
        </div>
      </AntdLayout.Content>
    </AntdLayout>
  );
};
