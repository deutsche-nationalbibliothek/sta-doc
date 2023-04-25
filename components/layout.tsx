import { Breadcrumb } from '@/entity/components/breadcrumb';
import { useHeadlines } from '@/hooks/headlines';
import { Layout as AntdLayout, Divider } from 'antd';
import { Footer } from './footer';
import { LoadingIndicator } from './loading-indicator';
import { Sidebar } from './sidebar';
import { Splitter } from './splitter';
import { TopBar } from './top-bar';
import 'antd/dist/reset.css';
import { CSSObject } from '@emotion/react';
import { compact } from 'lodash';
import { PropsWithChildren } from 'react';

export const layoutContentHeight =
  'calc(100vh - 2px - var(--topbar-height) - var(--breadcrumb-height) - var(--divider-top-height) - var(--divider-bottom-height) - var(--footer-height))';

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

const VerticalLayoutDivider = () => (
  <Divider
    type="vertical"
    className="no-print"
    css={{
      height: layoutContentHeight,
      maxWidth: 1,
    }}
  />
);

export default function Layout(props: LayoutProps) {
  return (
    <AntdLayout>
      <LoadingIndicator />
      <TopBar />
      <Breadcrumb />
      <HorizontalLayoutDivivder />
      <AntdLayout
        css={{
          height: layoutContentHeight,
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
}

const ContentSplitter: React.FC<PropsWithChildren> = ({ children }) => {
  const { nestedHeadlines, showHeadlines } = useHeadlines();

  return (
    <Splitter>
      {nestedHeadlines.length && showHeadlines
        ? compact([
            nestedHeadlines.length > 0 && <Sidebar key="sidebar" />,
            children,
          ])
        : [children]}
    </Splitter>
  );
};

const Content: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AntdLayout
      css={{
        height: layoutContentHeight,
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
              height: layoutContentHeight,
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
