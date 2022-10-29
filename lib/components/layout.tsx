import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout as AntdLayout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { createElement } from 'react';

const { Header, Content, Sider } = AntdLayout;

interface LayoutProps {
  children: React.ReactElement;
}
const keys = [];

const items: MenuProps['items'] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);
  keys.push(`sub${key}`);
  return {
    key: `sub${key}`,
    icon: createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = String(index * 4 + j + 1);
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

export default function Layout(props: LayoutProps) {
  console.log({ keys });
  return (
    <AntdLayout>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" items={[]} />
      </Header>
      <AntdLayout>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['sub1', '1', '2']}
            defaultOpenKeys={keys}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
          />
        </Sider>
        <AntdLayout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {props.children}
          </Content>
        </AntdLayout>
      </AntdLayout>
    </AntdLayout>
  );
}
