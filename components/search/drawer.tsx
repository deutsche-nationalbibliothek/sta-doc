import { SearchOutlined } from '@ant-design/icons';
import { Menu, Drawer } from 'antd';
import { useState } from 'react';
import { SolrSearch } from './solr';

export const SearchDrawer: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const onClose = () => setIsSearchOpen(false);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[]}
      items={[
        {
          label: (
            <>
              <SearchOutlined style={{ fontSize: 20 }} />
              <Drawer
                size="large"
                placement="right"
                onClose={onClose}
                open={isSearchOpen}
              >
                <SolrSearch />
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
