import { SearchOutlined } from '@ant-design/icons';
import { Drawer, Input, Menu } from 'antd';
import { useState } from 'react';

export const Search: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const onClose = () => setIsSearchOpen(false);

  const onSearch = (e: string) => {
    console.log(e);
  };

  return (
    <Menu
      theme="dark"
      style={{
        position: 'fixed',
        right: 50,
        display: 'inline-block',
      }}
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
                <Input.Search
                  placeholder="does not work yet"
                  onSearch={onSearch}
                />
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
