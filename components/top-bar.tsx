import { Layout as AntdLayout, Menu } from 'antd';
import Link from 'next/link';
import { Search } from './search';

export const TopBar: React.FC = () => {
  return (
    <AntdLayout.Header
      style={{ position: 'fixed', zIndex: 1, width: '100%' }}
      className="header"
    >
      <Menu
        theme="dark"
        style={{ width: 260, display: 'inline-block' }}
        mode="horizontal"
        items={[
          { label: <Link href="/">Home</Link>, key: 'home' },
          {
            label: 'RDA',
            key: 'RDA',
            children: [
              {
                label: <Link href="/entities/Q8566">Allgemeines</Link>,
                key: 'Allgemeines',
              },
              {
                label: <Link href="/entities/Q8477">Erfassungsmethode</Link>,
                key: 'Erfassungsmethode',
              },
              {
                label: <Link href="/rda/properties">Elemente</Link>,
                key: 'Elemente',
              },
              {
                label: <Link href="/entities/Q8567">Ressourcentypen</Link>,
                key: 'Ressourcentypen',
              },
              {
                label: <Link href="/entities/Q8568">Anwendungsprofile</Link>,
                key: 'Anwendungsprofile',
              },
            ],
          },
          {
            label: 'GND',
            key: 'GND',
            children: [
              {
                label: <Link href="/gnd/fields">Datenfelder</Link>,
                key: 'Datenfelder',
              },
            ],
          },
        ]}
      />
      <Search />
    </AntdLayout.Header>
  );
};
