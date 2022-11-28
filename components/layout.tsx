import { Breadcrumb } from '@/entity/components/breadcrumb';
import { useHeadlines } from '@/hooks/use-headlines';
import { Layout as AntdLayout } from 'antd';
import { LoadingIndicator } from './loading-indicator';
import { Sidebar } from './sidebar';
import { Splitter } from './splitter';
import { TopBar } from './top-bar';

interface LayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: LayoutProps) {
  const { nestedHeadlines, headlines } = useHeadlines();

  const layout = (
    <AntdLayout
      style={{
        paddingLeft: nestedHeadlines.length === 0 ? '10%' : 26,
        paddingRight: nestedHeadlines.length === 0 ? '10%' : 26,
      }}
    >
      <AntdLayout.Content>
        <Breadcrumb />
        <div
          id="main-scroll-container"
          style={{
            height: 'calc(100vh - var(--topbar-height) - 52px)', //window.innerHeight - 64 - 4 , //- 48 * 2, // topbar- and divider-height
            overflowY: 'auto',
            padding: '0px 25px',
          }}
        >
          {props.children}
        </div>
      </AntdLayout.Content>
    </AntdLayout>
  );

  return (
    <AntdLayout>
      <LoadingIndicator />
      <TopBar />
      <AntdLayout
        style={{
          height: 'calc(100vh - var(--topbar-height))',
        }}
      >
        {headlines.length > 0 ? (
          <Splitter>
            <Sidebar />
            {layout}
          </Splitter>
        ) : (
          layout
        )}
      </AntdLayout>
    </AntdLayout>
  );
}
