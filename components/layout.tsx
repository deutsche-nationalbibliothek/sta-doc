import { Breadcrumb } from '@/entity/components/breadcrumb';
import { useHeadlines } from '@/hooks/headlines';
import { Layout as AntdLayout, ConfigProvider, Divider, theme } from 'antd';
import { Footer } from './footer';
import { LoadingIndicator } from './loading-indicator';
import { Sidebar } from './sidebar';
import { Splitter } from './splitter';
import { TopBar } from './top-bar';
import 'antd/dist/reset.css';
import { CSSObject } from '@emotion/react';
import { compact } from 'lodash';
import { PropsWithChildren } from 'react';
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { SidebarSmallScreen } from './sidebar-small-screen';

export const layoutContentHeight = (isSmallScreen: boolean) =>
  isSmallScreen
    ? 'calc(100vh - 2px - var(--topbar-mobile-height) - var(--breadcrumb-mobile-height) - var(--divider-top-height) - var(--divider-bottom-height) - var(--footer-mobile-height))'
    : 'calc(100vh - 2px - var(--topbar-height) - var(--breadcrumb-height) - var(--divider-top-height) - var(--divider-bottom-height) - var(--footer-height))';

interface LayoutProps {
  children: React.ReactElement;
}

const HorizontalLayoutDivivder = () => (
  <Divider
    className="no-print"
    css={{
      marginLeft: 8,
      marginRight: 8,
      width: 'calc(100vw - 16px)',
      minWidth: 'unset',
      marginTop: 'calc(var(--divider-top-height) / 2)',
      marginBottom: 'calc(var(--divider-top-height) / 2)',
      background: 'var(--light-gray)',
    }}
  />
);

const VerticalLayoutDivider = () => {
  const isSmallScreen = useIsSmallScreen();
  return (
    <Divider
      type="vertical"
      className="no-print"
      css={{
        height: layoutContentHeight(isSmallScreen),
        maxWidth: 1,
      }}
    />
  );
};

export default function Layout(props: LayoutProps) {
  const isSmallScreen = useIsSmallScreen();
  const { compactAlgorithm } = theme;

  return (
    <ConfigProvider
      theme={{
        algorithm: isSmallScreen ? compactAlgorithm : undefined,
      }}
    >
      <AntdLayout>
        <LoadingIndicator />
        <TopBar />
        <Breadcrumb />
        <HorizontalLayoutDivivder />
        <AntdLayout
          css={{
            height: layoutContentHeight(isSmallScreen),
            '@media print': {
              height: 'initial',
            },
          }}
        >
          <VerticalLayoutDivider />
          <div
            css={{
              width: '100% !important',
            }}
          >
            <ContentSplitter>
              <Content key="content">{props.children}</Content>
            </ContentSplitter>
          </div>
          <VerticalLayoutDivider />
        </AntdLayout>
        <HorizontalLayoutDivivder />
        <Footer />
      </AntdLayout>
    </ConfigProvider>
  );
}

const ContentSplitter: React.FC<PropsWithChildren> = ({ children }) => {
  const { nestedHeadlines, showHeadlines } = useHeadlines();
  const hasHeadlinesToShow = nestedHeadlines.length > 0 && showHeadlines;

  const isSmallScreen = useIsSmallScreen();

  return (
    <>
      <Splitter>
        {hasHeadlinesToShow && !isSmallScreen
          ? compact([
              nestedHeadlines.length > 0 && <Sidebar key="sidebar" />,
              children,
            ])
          : [children]}
      </Splitter>
      {hasHeadlinesToShow && isSmallScreen && <SidebarSmallScreen />}
    </>
  );
};

const Content: React.FC<PropsWithChildren> = ({ children }) => {
  const isSmallScreen = useIsSmallScreen();
  return (
    <AntdLayout
      css={{
        height: layoutContentHeight(isSmallScreen),
        '@media print': {
          height: 'initial',
        },
        backgroundColor: 'white',
      }}
    >
      <AntdLayout.Content>
        <div
          css={
            {
              overflowY: 'auto',
              padding: '0px 35px',
              height: layoutContentHeight(isSmallScreen),
              '@media print': {
                overflowY: 'visible !important',
                height: 'initial',
                padding: 0,
              },
              '& > .ant-collapse:last-child': {
                // prevent footer hiding border
                marginBottom: 2,
              },
            } as unknown as CSSObject
          }
          className="main-scroll-container"
          id="main-scroll-container"
        >
          {children}
        </div>
      </AntdLayout.Content>
    </AntdLayout>
  );
};
