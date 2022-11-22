import { useHeadlines } from '@/hooks/use-headlines';
import { Layout } from 'antd';
import { ContentNavigation } from './content-navigation';

export const Sidebar: React.FC = () => {
  const { headlines } = useHeadlines();

  return (
    headlines.length > 1 && (
      <Layout.Sider theme={'light'} width={'15%'}>
        <ContentNavigation />
      </Layout.Sider>
    )
  );
};
