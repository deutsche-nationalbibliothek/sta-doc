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
        <AntdLayout style={{
          paddingLeft: 26,
          paddingRight: 26,
          paddingTop: 'var(--topbar-height)'
        }}>
          <AntdLayout.Content>
            {props.children}
          </AntdLayout.Content>
        </AntdLayout>
      </AntdLayout>
    </AntdLayout>
  );
}
