import { Link } from '@/lib/next-link';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Drawer, Tooltip } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { SolrSearch } from './solr';

interface SearchDrawerProps {
  isSearchOpen: boolean;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({
  isSearchOpen,
  setIsSearchOpen,
}) => {
  const onCloseDrawer = () => setIsSearchOpen(false);

  return (
    <Drawer
      placement="right"
      onClose={onCloseDrawer}
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
  );
};
