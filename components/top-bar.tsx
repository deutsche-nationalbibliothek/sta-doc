import { useNamespace } from '@/hooks/use-namespace';
import { Link } from '@/lib/next-link';
import { useRouter } from '@/lib/next-use-router';
import { Col, Layout as AntdLayout, Menu, Row } from 'antd';
import { SearchDrawer } from './search/drawer';

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
              router.asPath.match(/.*(?=(\?.*|=#.*))|.*/)[0],
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
                    label: <Link href="/rda/elements">Elemente</Link>,
                    key: '/rda/elements',
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
                    <Link href="/entities/Q10170">GND</Link>
                  </span>
                ),
                key: 'GND',
                children: [
                  {
                    label: (
                      <Link href="/entities/Q10171">
                        Satzarten und Entitätencodierungen
                      </Link>
                    ),
                    key: '/entities/Q10171',
                  },
                  {
                    label: <Link href="/gnd/fields">Datenfelder</Link>,
                    key: '/gnd/fields',
                  },
                  {
                    label: <Link href="/entities/Q10172">Relationscodes</Link>,
                    key: '/entities/Q10172',
                  },
                  {
                    label: (
                      <Link href="/entities/Q10173">normiertes Vokabular</Link>
                    ),
                    key: '/entities/Q10173',
                  },
                  {
                    label: <Link href="/entities/Q1359">GND-Systematik</Link>,
                    key: '/entities/Q1359',
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
        {router.pathname !== '/search' && (
          <Col style={{ flex: '0 0 0' }} span={6}>
            <SearchDrawer />
          </Col>
        )}
      </Row>
    </AntdLayout.Header>
  );
};
