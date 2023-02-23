import { EntityLink } from '@/entity/components/preview/link';
import { StringValueComponent } from '@/entity/components/values/string';
import { useSWR } from '@/lib/swr';
import { Doc, SearchResult } from '@/types/search';
import { SearchOutlined } from '@ant-design/icons';
import { Card, Drawer, Input, List, Menu, Typography } from 'antd';
import { debounce, uniq } from 'lodash';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
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
