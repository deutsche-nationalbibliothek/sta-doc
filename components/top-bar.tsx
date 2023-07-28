import { useNamespace } from '@/hooks/use-namespace';
import { Link } from '@/lib/next-link';
import { useRouter } from '@/lib/next-use-router';
import { Layout as AntdLayout, Menu, theme, ConfigProvider } from 'antd';
import { compact } from 'lodash';
import { SearchDrawer } from './search/drawer';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { CSSObject } from '@emotion/react';
import { useMemo, useState } from 'react';
import useIsSmallScreen from '@/hooks/use-is-small-screen';

// RDA-A-0-allgemeines ist jetzt RDA-A
// RDA-A-0-ANWENDUNGSPROFILE ist jetzt RDA-A

export const TopBar: React.FC = () => {
  const { namespace } = useNamespace();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const namespaceDomain = router.query.domain as string | undefined;

  const pathMatch = router.asPath.match(/.*(?=(\?.*|=#.*))|.*/);
  const { token } = theme.useToken();

  const isSmallScreen = useIsSmallScreen();

  const menuColorStyles: CSSObject = useMemo(
    () => ({
      background: 'var(--top-bar-color) !important',
      '& li .ant-menu-title-content a': {
        color: `${token.colorText} !important`,
      },
      '& li.ant-menu-item-selected': {
        backgroundColor: `${token.colorPrimary} !important`,
        '& .ant-menu-title-content': {
          color: `${token.colorText} !important`,
        },
      },
      '& li.ant-menu-submenu-selected': {
        backgroundColor: `${token.colorPrimary} !important`,
        '& .ant-menu-title-content': {
          color: `${token.colorText} !important`,
        },
      },
      '& li.ant-menu-submenu-horizontal, li.ant-menu-item': {
        paddingInline: isSmallScreen ? 10 : undefined,
      },
    }),
    [token.colorPrimary, token.colorText, isSmallScreen]
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: isSmallScreen ? 12 : 14,
        },
      }}
    >
      <AntdLayout.Header
        css={{
          lineHeight: isSmallScreen
            ? 'var(--topbar-mobile-height)'
            : 'var(--topbar-height)',
          height: isSmallScreen
            ? 'var(--topbar-mobile-height) !important'
            : 'var(--topbar-height) !important',
          background: 'var(--top-bar-color)',
        }}
      >
        <Menu
          css={{
            ...menuColorStyles,
          }}
          mode="horizontal"
          selectedKeys={compact([
            namespace,
            pathMatch && pathMatch[0],
            namespaceDomain,
          ])}
          items={[
            {
              label: (
                <span className="ant-menu-item">
                  <Link href="/">
                    <HomeOutlined />
                  </Link>
                </span>
              ),
              key: '/',
            },
            {
              label: (
                <span className="ant-menu-item">
                  <Link href="/RDA">RDA DACH</Link>
                </span>
              ),
              key: 'RDA',
              children: [
                {
                  label: <Link href="/RDA-A">Allgemeines</Link>,
                  key: '/RDA-A',
                },
                {
                  label: <Link href="/RDA-E">Elemente</Link>,
                  key: '/RDA-E',
                },
                {
                  label: <Link href="/RDA-R">Ressourcentypen</Link>,
                  key: '/RDA-R',
                },
                {
                  label: <Link href="/RDA-AP">Anwendungsprofile</Link>,
                  key: '/RDA-AP',
                },
                {
                  label: <Link href="/RDA-I">Index</Link>,
                  key: '/entities/rda',
                },
              ],
            },
            {
              label: (
                <span className="ant-menu-item">
                  <Link href="/GND">GND</Link>
                </span>
              ),
              key: 'GND',
              children: [
                {
                  label: (
                    <Link href="/GND-EC">
                      Satzarten und Entitätencodierungen
                    </Link>
                  ),
                  key: '/GND-EC',
                },
                {
                  label: <Link href="/GND-DF">Datenfelder</Link>,
                  key: '/GND-DF',
                },
                {
                  label: <Link href="/GND-RC">Relationscodes</Link>,
                  key: '/GND-RC',
                },
                {
                  label: <Link href="/GND-VW">normiertes Vokabular</Link>,
                  key: '/GND-VW',
                },
                {
                  label: <Link href="/GND-VW-SYSTEMATIK">GND-Systematik</Link>,
                  key: '/GND-VW-SYSTEMATIK',
                },
                {
                  label: <Link href="/GND-I">Index</Link>,
                  key: '/entities/gnd',
                },
              ],
            },
            {
              label: (
                <span className="ant-menu-item">
                  {router.pathname !== '/search' && (
                    <SearchOutlined
                      css={{ fontSize: isSmallScreen ? 16 : 20 }}
                    />
                  )}
                  <SearchDrawer
                    setIsSearchOpen={setIsSearchOpen}
                    isSearchOpen={isSearchOpen}
                  />
                </span>
              ),
              key: 'search',
              style: {
                position: 'absolute',
                right: isSmallScreen ? 0 : 50,
              },
              onClick: () => !isSearchOpen && setIsSearchOpen(true),
            },
          ]}
        />
      </AntdLayout.Header>
    </ConfigProvider>
  );
};
