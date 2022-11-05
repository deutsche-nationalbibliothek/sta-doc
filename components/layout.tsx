import { Layout as AntdLayout, Menu } from 'antd';
import { Sidebar } from './sidebar';

interface LayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: LayoutProps) {
  return (
    <AntdLayout>
      <AntdLayout.Header
        style={{ position: 'fixed', zIndex: 1, width: '100%' }}
        className="header"
      >
        <Menu theme="dark" mode="horizontal" items={[]} />
      </AntdLayout.Header>
      <AntdLayout>
        <Sidebar />
        <AntdLayout style={{ padding: '0 24px 24px' }}>
          <AntdLayout.Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {props.children}
          </AntdLayout.Content>
        </AntdLayout>
      </AntdLayout>
    </AntdLayout>
  );
}
