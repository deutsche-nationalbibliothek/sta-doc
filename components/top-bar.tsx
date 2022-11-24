import { useDataSource } from '@/hooks/use-pagetype';
import { Col, Layout as AntdLayout, Menu, Row } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search } from './search';

export const TopBar: React.FC = () => {
  const { dataSource } = useDataSource();
  const router = useRouter();
  const dataSourceDomain = router.query.domain as string | undefined;

  return (
    <AntdLayout.Header style={{ zIndex: 1, width: '100%' }}>
      <Row justify={'space-between'}>
        <Col span={3}>
          <Menu
            theme="dark"
            style={{ minWidth: 240 }}
            mode="horizontal"
            selectedKeys={[
              dataSource,
              router.asPath.match(/.*(?=#.*)|.*/)[0],
              dataSourceDomain,
            ]}
            items={[
              { label: <Link href="/">Home</Link>, key: '/' },
              {
                label: (
                  <span onClick={() => router.push('/entities?domain=RDA')}>
                    RDA
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
                ],
              },
              {
                label: (
                  <span onClick={() => router.push('/entities?domain=GND')}>
                    GND
                  </span>
                ),
                key: 'GND',
                children: [
                  {
                    label: <Link href="/gnd/fields">Datenfelder</Link>,
                    key: '/gnd/fields',
                  },
                ],
              },
            ]}
          />
        </Col>
        <Col style={{ flex: '0 0 0' }} span={2}>
          <Search />
        </Col>
      </Row>
    </AntdLayout.Header>
  );
};
