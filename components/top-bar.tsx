import { useNamespace } from '@/hooks/use-namespace';
import { Link } from '@/lib/next-link';
import { useRouter } from '@/lib/next-use-router';
import { Col, Layout as AntdLayout, Menu, Row, theme } from 'antd';
import { compact } from 'lodash';
import { SearchDrawer } from './search/drawer';
import { HomeOutlined } from '@ant-design/icons';
import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';

export const TopBar: React.FC = () => {
  const { namespace } = useNamespace();
  const router = useRouter();
  const namespaceDomain = router.query.domain as string | undefined;

  const pathMatch = router.asPath.match(/.*(?=(\?.*|=#.*))|.*/);
  const { token } = theme.useToken();

  const menuColorStyles: CSSObject = useMemo(
    () => ({
      background: 'var(--top-bar-color) !important',
      '& li .ant-menu-title-content a': {
        color: `${token.colorText} !important`,
      },
      '& li.ant-menu-item': {
        backgroundColor: 'var(--top-bar-height) !important',
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
    }),
    [token.colorPrimary, token.colorText]
  );

  return (
    <AntdLayout.Header
      css={{
        height: 'var(--top-bar-height)',
        background: 'var(--top-bar-color)',
      }}
    >
      <Row justify={'space-between'}>
        <Col>
          <Menu
            css={{
              justifyContent: 'space-around',
              '& li': {
                flexGrow: '1 !important',
                display: 'flex !important',
                justifyContent: 'space-around',
                width: 120,
              },
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
                  <Link href="/">
                    <HomeOutlined />
                  </Link>
                ),
                key: '/',
              },
              {
                label: (
                  <span className="ant-menu-item">
                    <Link href="/entities/Q8469">RDA Dach</Link>
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
                  <span className="ant-menu-item">
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
          <Col
            css={{
              '& li': {
                display: 'flex !important',
                justifyContent: 'end',
              },
            }}
          >
            <SearchDrawer />
          </Col>
        )}
      </Row>
    </AntdLayout.Header>
  );
};
