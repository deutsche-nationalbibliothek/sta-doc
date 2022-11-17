import { useHeadlines } from '@/hooks/headlines';
import { Layout as AntdLayout } from 'antd';
import { LoadingIndicator } from './loading-indicator';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

interface LayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: LayoutProps) {
  const { nestedHeadlines } = useHeadlines();

  return (
    <AntdLayout>
      <LoadingIndicator />
      <TopBar />
      <AntdLayout>
        <Sidebar />
        <AntdLayout
          style={{
            paddingLeft: nestedHeadlines.length === 0 ? '10%' : 26,
            paddingRight: nestedHeadlines.length === 0 ? '10%' : 26,
            paddingTop: 'var(--topbar-height)',
            minHeight: '100vh',
          }}
        >
          <AntdLayout.Content>{props.children}</AntdLayout.Content>
        </AntdLayout>
      </AntdLayout>
    </AntdLayout>
  );
}
