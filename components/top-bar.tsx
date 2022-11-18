import { usePageType } from '@/hooks/use-pagetype';
import { DataSource } from '@/types/entity';
import { dataSources } from '@/utils/constants';
import { Layout as AntdLayout, Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search } from './search';

export const TopBar: React.FC = () => {
  const { pageType } = usePageType();
  const router = useRouter();

  const selectedGroupKey = Object.entries(dataSources).reduce(
    (acc: DataSource | undefined, [key, val]) => {
      if (
        pageType &&
        pageType.id &&
        val.findIndex((item) => item === pageType.id) >= 0
      ) {
        return key as DataSource;
      }
      return acc;
    },
    undefined
  );

  return (
    <AntdLayout.Header
      style={{ position: 'fixed', zIndex: 1, width: '100%' }}
      className="header"
    >
      <Menu
        theme="dark"
        style={{ width: 260, display: 'inline-block' }}
        mode="horizontal"
        selectedKeys={[selectedGroupKey, router.asPath]}
        items={[
          { label: <Link href="/">Home</Link>, key: '/' },
          {
            label: 'RDA',
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
            label: 'GND',
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
