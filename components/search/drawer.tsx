import { Link } from '@/lib/next-link';
import { RightOutlined, SearchOutlined } from '@ant-design/icons';
import { Menu, Drawer, Tooltip } from 'antd';
import { useState } from 'react';
import { SolrSearch } from './solr';

export const SearchDrawer: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const onClose = () => setIsSearchOpen(false);

  const onCloseDrawer = () => setIsSearchOpen(false);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[]}
      items={[
        {
          label: (
            <>
              <SearchOutlined
              // style={{ fontSize: 20 }}
              />
              <Drawer
                size="large"
                placement="right"
                onClose={onClose}
                open={isSearchOpen}
                extra={
                  <Tooltip placement="left" title="Suche auf seperater Seite">
                    <Link onClick={onCloseDrawer} href={'/search'}>
                      <RightOutlined />
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
