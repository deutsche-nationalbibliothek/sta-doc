import { Layout as AntdLayout } from 'antd';
import { LoadingIndicator } from './loading-indicator';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

interface LayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: LayoutProps) {
  return (
    <AntdLayout>
      <LoadingIndicator />
      <TopBar />
      <AntdLayout>
        <Sidebar />
        <AntdLayout
          style={{
            paddingLeft: 26,
            paddingRight: 26,
            paddingTop: 'var(--topbar-height)',
          }}
        >
          <AntdLayout.Content>{props.children}</AntdLayout.Content>
        </AntdLayout>
      </AntdLayout>
    </AntdLayout>
  );
}
