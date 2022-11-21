import { useDataSource } from '@/hooks/use-pagetype';
import { Layout as AntdLayout, Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search } from './search';

export const TopBar: React.FC = () => {
  const { dataSource } = useDataSource();
  const router = useRouter();
  const dataSourceDomain = router.query.domain as string | undefined;

  return (
    <AntdLayout.Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <Menu
        theme="dark"
        style={{ width: '66%', display: 'inline-block' }}
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
                label: <Link href="/entities/Q8477">Erfassungsmethode</Link>,
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
                label: <Link href="/entities/Q8568">Anwendungsprofile</Link>,
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
      <Search />
    </AntdLayout.Header>
  );
};
