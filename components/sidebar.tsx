import { useHeadlines } from '@/hooks/use-headlines';
import { Layout } from 'antd';
import { ContentNavigation } from './content-navigation';

export const Sidebar: React.FC = () => {
  const { headlines } = useHeadlines();

  return (
    headlines.length > 1 && (
      <Layout.Sider theme={'light'} width={'100%'} style={{ height: '100%' }}>
        <ContentNavigation />
      </Layout.Sider>
    )
  );
};
