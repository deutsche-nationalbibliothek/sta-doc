import namespaceConfig from '@/config/namespace';
import { useNamespace } from '@/hooks/use-namespace';
import { Link } from '@/lib/next-link';
import { useRouter } from '@/lib/next-use-router';
import {
  isPrimaryNamepsace,
  namespaceFromAppPath,
} from '@/types/namespace';
import { Layout as AntdLayout, Menu, theme, ConfigProvider } from 'antd';
import { compact } from 'lodash';
import { SearchDrawer } from './search/drawer';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { CSSObject } from '@emotion/react';
import { useMemo, useState } from 'react';
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import useTranslation from 'next-translate/useTranslation';
import { AuthStatus } from './auth-status';
import LocaleSwitcher from './locale-switcher';
const topBarEditorClusterGap = (compact: boolean) => (compact ? 18 : 28);

export const TopBar: React.FC = () => {
  const { t } = useTranslation('top-bar');
  const { namespace } = useNamespace();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const namespaceDomain = router.query.domain as string | undefined;

  const pathMatch = router.asPath.match(/.*(?=(\?.*|=#.*))|.*/);
  const { token } = theme.useToken();

  const isSmallScreen = useIsSmallScreen();

  const effectiveNamespace = namespace ?? namespaceFromAppPath(router.asPath);
  const menuPrimaryColor = useMemo(() => {
    const colorKey =
      effectiveNamespace && isPrimaryNamepsace(effectiveNamespace)
        ? effectiveNamespace
        : 'unspecific';
    return namespaceConfig.colors[colorKey].primary;
  }, [effectiveNamespace]);

  const menuColorStyles: CSSObject = useMemo(
    () => ({
      background: 'var(--top-bar-color) !important',
      '& li .ant-menu-title-content a': {
        color: `${token.colorText} !important`,
      },
      '& li.ant-menu-item-selected': {
        backgroundColor: `${menuPrimaryColor} !important`,
        '& .ant-menu-title-content': {
          color: `${token.colorText} !important`,
        },
      },
      '& li.ant-menu-submenu-selected': {
        backgroundColor: `${menuPrimaryColor} !important`,
        '& .ant-menu-title-content': {
          color: `${token.colorText} !important`,
        },
      },
      '& li.ant-menu-submenu-horizontal, li.ant-menu-item': {
        paddingInline: isSmallScreen ? 10 : undefined,
      },
    }),
    [menuPrimaryColor, token.colorText, isSmallScreen],
  );

  return (
    <ConfigProvider
      theme={{
        inherit: true,
        token: {
          fontSize: isSmallScreen ? 12 : 14,
        },
      }}
    >
      <AntdLayout.Header
        css={{
          display: 'flex',
          alignItems: 'center',
          lineHeight: isSmallScreen
            ? 'var(--topbar-mobile-height)'
            : 'var(--topbar-height)',
          height: isSmallScreen
            ? 'var(--topbar-mobile-height) !important'
            : 'var(--topbar-height) !important',
          background: 'var(--top-bar-color)',
          borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
        }}
      >
        <Menu
          css={{
            ...menuColorStyles,
            flex: '1 1 auto',
            minWidth: 0,
            position: 'relative',
            borderBottom: 'none',
          }}
          mode="horizontal"
          selectedKeys={compact([
            effectiveNamespace,
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
                  label: <Link href="/RDA-A">{t('RDA-A')}</Link>,
                  key: '/RDA-A',
                },
                {
                  label: <Link href="/RDA-E">{t('RDA-E')}</Link>,
                  key: '/RDA-E',
                },
                {
                  label: <Link href="/RDA-R">{t('RDA-R')}</Link>,
                  key: '/RDA-R',
                },
                {
                  label: <Link href="/RDA-AP">{t('RDA-AP')}</Link>,
                  key: '/RDA-AP',
                },
                {
                  label: <Link href="/RDA-I">{t('RDA-I')}</Link>,
                  key: '/entities/rda',
                },
              ],
            },
            {
              label: (
                <span className="ant-menu-item">
                  <Link href="/GND">{t('GND')}</Link>
                </span>
              ),
              key: 'GND',
              children: [
                {
                  label: <Link href="/GND-A">{t('GND-A')}</Link>,
                  key: '/GND-A',
                },
                {
                  label: <Link href="/GND-ET">{t('GND-ET')}</Link>,
                  key: '/GND-ET',
                },
                {
                  label: <Link href="/GND-D">{t('GND-D')}</Link>,
                  key: '/GND-D',
                },
                {
                  label: <Link href="/GND-AK">{t('GND-AK')}</Link>,
                  key: '/GND-AK',
                },
                {
                  label: <Link href="/GND-I">{t('GND-I')}</Link>,
                  key: '/entities/gnd',
                },
              ],
            },
          ]}
        />
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            flex: 'none',
            gap: topBarEditorClusterGap(isSmallScreen),
            marginLeft: 8,
            paddingRight: 8,
            lineHeight: 1.2,
          }}
        >
          <AuthStatus compact={isSmallScreen} />
          <button
            type="button"
            aria-label="Suche"
            title="Suche"
            onClick={() => !isSearchOpen && setIsSearchOpen(true)}
            css={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              padding: 4,
              border: 'none',
              background: 'transparent',
              color: token.colorText,
              cursor: 'pointer',
              fontSize: isSmallScreen ? 12 : 14,
              lineHeight: 1,
            }}
          >
            {router.pathname !== '/search' && <SearchOutlined />}
          </button>
          <LocaleSwitcher />
        </div>
      </AntdLayout.Header>
      <SearchDrawer
        setIsSearchOpen={setIsSearchOpen}
        isSearchOpen={isSearchOpen}
      />
    </ConfigProvider>
  );
};
