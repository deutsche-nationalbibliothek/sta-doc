import { Link } from '@/lib/next-link';
import { ArrowRightOutlined, SearchOutlined } from '@ant-design/icons';
import { Menu, Drawer, Tooltip } from 'antd';
import { useState } from 'react';
import { SolrSearch } from './solr';
import useIsSmallScreen from '@/hooks/use-is-small-screen';

export const SearchDrawer: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const onClose = () => setIsSearchOpen(false);
  const onCloseDrawer = () => setIsSearchOpen(false);

  const isSmallScreen = useIsSmallScreen();

  return (
    <Menu
      css={{
        width: isSmallScreen ? 45 : 90,
        background: 'var(--top-bar-color) !important',
        lineHeight: isSmallScreen
          ? 'var(--topbar-mobile-height)'
          : 'var(--topbar-height)',
        height: isSmallScreen
          ? 'var(--topbar-mobile-height)'
          : 'var(--topbar-height)',
      }}
      mode="horizontal"
      selectedKeys={[]}
      items={[
        {
          label: (
            <>
              <SearchOutlined css={{ fontSize: isSmallScreen ? 16 : 20 }} />
              <Drawer
                placement="right"
                onClose={onClose}
                open={isSearchOpen}
                extra={
                  <Tooltip placement="left" title="Suche auf seperater Seite">
                    <Link onClick={onCloseDrawer} href={'/search'}>
                      <ArrowRightOutlined />
                    </Link>
                  </Tooltip>
                }
              >
                <SolrSearch placeholder="Suche" onCloseDrawer={onCloseDrawer} />
              </Drawer>
            </>
          ),
          key: 'search',
          onClick: () => !isSearchOpen && setIsSearchOpen(true),
        },
      ]}
    />
  );
};
