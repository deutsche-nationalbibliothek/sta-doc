import { useNamespace } from '@/hooks/use-namespace';
import { Link } from '@/lib/next-link';
import { useRouter } from '@/lib/next-use-router';
import { Col, Layout as AntdLayout, Menu, Row } from 'antd';
import { Search } from './search';

export const TopBar: React.FC = () => {
  const { namespace } = useNamespace();
  const router = useRouter();
  const namespaceDomain = router.query.domain as string | undefined;

  return (
    <AntdLayout.Header style={{ zIndex: 1, width: '100%' }}>
      <Row justify={'space-between'}>
        <Col span={6}>
          <Menu
            theme="dark"
            style={{ minWidth: 240 }}
            mode="horizontal"
            selectedKeys={[
              namespace,
              router.asPath.match(/.*(?=#.*)|.*/)[0],
              namespaceDomain,
            ]}
            items={[
              { label: <Link href="/">Home</Link>, key: '/' },
              {
                label: (
                  <span className="ant-menu-item" style={{ padding: 0 }}>
                    <Link href="/entities/Q8469">RDA</Link>
                  </span>
                ),
                key: 'RDA',
                children: [
                  {
                    label: <Link href="/entities/Q8566">Allgemeines</Link>,
                    key: '/entities/Q8566',
                  },
                  {
                    label: (
                      <Link href="/entities/Q8477">Erfassungsmethode</Link>
                    ),
                    key: '/entities/Q8477',
                  },
                  {
                    label: <Link href="/rda/properties">Elemente</Link>,
                    key: '/rda/properties',
                  },
                  {
                    label: <Link href="/entities/Q8567">Ressourcentypen</Link>,
                    key: '/entities/Q8567',
                  },
                  {
                    label: (
                      <Link href="/entities/Q8568">Anwendungsprofile</Link>
                    ),
                    key: '/entities/Q8568',
                  },
                  {
                    label: <Link href="/entities/rda">Index</Link>,
                    key: '/entities/rda',
                  },
                ],
              },
              {
                label: (
                  <span className="ant-menu-item" style={{ padding: 0 }}>
                    <Link href="/gnd">GND</Link>
                  </span>
                ),
                key: 'GND',
                children: [
                  {
                    label: <Link href="/gnd/fields">Datenfelder</Link>,
                    key: '/gnd/fields',
                  },
                  {
                    label: <Link href="/entities/gnd">Index</Link>,
                    key: '/entities/gnd',
                  },
                ],
              },
            ]}
          />
        </Col>
        <Col style={{ flex: '0 0 0' }} span={6}>
          <Search />
        </Col>
      </Row>
    </AntdLayout.Header>
  );
};
