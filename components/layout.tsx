import { Breadcrumb } from '@/entity/components/breadcrumb';
import { useHeadlines } from '@/hooks/headlines';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { Layout as AntdLayout } from 'antd';
import { Footer } from './footer';
import { LoadingIndicator } from './loading-indicator';
import { Sidebar } from './sidebar';
import { Splitter } from './splitter';
import { TopBar } from './top-bar';

interface LayoutProps {
  children: React.ReactElement;
}

export default function Layout(props: LayoutProps) {
  const { nestedHeadlines, showHeadlines } = useHeadlines();
  return (
    <AntdLayout>
      <LoadingIndicator />
      <TopBar />
      <AntdLayout className="main-layout-height">
        {nestedHeadlines.length && showHeadlines ? (
          <Splitter>
            {nestedHeadlines.length > 0 && <Sidebar />}
            <Content>{props.children}</Content>
          </Splitter>
        ) : (
          <Content>{props.children}</Content>
        )}
      </AntdLayout>
      <Footer />
    </AntdLayout>
  );
}

const Content: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { headlines } = useInitialHeadlines();
  return (
    <AntdLayout
      style={{
        paddingLeft: headlines && headlines.length > 1 ? 26 : '5%',
        paddingRight: headlines && headlines.length > 1 ? 26 : '5%',
      }}
    >
      <AntdLayout.Content>
        <Breadcrumb />
        <div className={'main-scroll-container'} id="main-scroll-container">
          {children}
        </div>
      </AntdLayout.Content>
    </AntdLayout>
  );
};
