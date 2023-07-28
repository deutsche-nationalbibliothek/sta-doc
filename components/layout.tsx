import { Breadcrumb } from '@/entity/components/breadcrumb';
import { Layout as AntdLayout, Divider } from 'antd';
import { Footer } from './footer';
import { LoadingIndicator } from './loading-indicator';
import { Sidebar } from './sidebar';
import { Splitter } from './splitter';
import { TopBar } from './top-bar';
import 'antd/dist/reset.css';
import { CSSObject } from '@emotion/react';
import { compact } from 'lodash';
import { PropsWithChildren, useEffect, useRef } from 'react';
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { SidebarSmallScreen } from './sidebar-small-screen';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import React from 'react';
import { useHeadlines } from '@/hooks/headlines';

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

const Layout: React.FC<LayoutProps> = React.memo((props) => {
  const isSmallScreen = useIsSmallScreen();
  return (
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
  );
});

export default Layout;

const ContentSplitter: React.FC<PropsWithChildren> = ({ children }) => {
  const { headlines } = useInitialHeadlines();
  const isSmallScreen = useIsSmallScreen();
  const { showHeadlines } = useHeadlines();

  const hasAndShouldShowHeadlines =
    headlines && headlines.length > 1 && showHeadlines;

  return (
    <>
      <Splitter>
        {compact([
          !isSmallScreen && hasAndShouldShowHeadlines && (
            <Sidebar key="sidebar" />
          ),
          children,
        ])}
      </Splitter>
      {isSmallScreen && hasAndShouldShowHeadlines && <SidebarSmallScreen />}
    </>
  );
};

const Content: React.FC<PropsWithChildren> = ({ children }) => {
  const isSmallScreen = useIsSmallScreen();
  const mainLayoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      const container = mainLayoutRef.current;
      if (container) {
        const actions: Record<string, () => void> = {
          ArrowDown: () => (container.scrollTop += 50),
          ArrowUp: () => (container.scrollTop -= 50),
          PageDown: () => (container.scrollTop += container.clientHeight),
          PageUp: () => (container.scrollTop -= container.clientHeight),
          Home: () => (container.scrollTop = 0),
          End: () => (container.scrollTop = container.scrollHeight),
        };
        if (e.key in actions) {
          e.preventDefault();
          actions[e.key]();
        }
      }
    };
    window.addEventListener('keydown', handleArrowKeys);
    return () => {
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, []);

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
          ref={mainLayoutRef}
        >
          {children}
        </div>
      </AntdLayout.Content>
    </AntdLayout>
  );
};
