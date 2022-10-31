import { useHeadlines } from '@/hooks/headlines';
import { Layout } from 'antd';
import { ContentNavigation } from './content-navigation';

export const Sidebar: React.FC = () => {
  const { headlines } = useHeadlines();
  return (
    <Layout.Sider theme={'light'} width={400}>
      {headlines.length && <ContentNavigation headlines={headlines} />}
    </Layout.Sider>
  );
};

