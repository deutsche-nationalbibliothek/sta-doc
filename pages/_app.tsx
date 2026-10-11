// import '../styles/globals.less';
import type { AppProps } from 'next/app';
import type { NextComponentType, NextPageContext } from 'next';
import HeadlinesProvider from '@/hooks/headlines';
import Layout from '@/components/layout';
import IsLoadingContextProvider from '@/hooks/use-loading-state';
import { CodingsPreferencesProvider } from '@/hooks/use-codings-preference';
import { NamespaceProvider } from '@/hooks/use-namespace';
import { App, ConfigProvider } from 'antd';
import deDE from 'antd/lib/locale/de_DE';
import InitialHeadlinesProvider from '@/hooks/initial-headlines';
import { NextAdapter } from 'next-query-params';
import {
  QueryParamProvider,
  QueryParamAdapterComponent,
} from 'use-query-params';
import ApplicationProfileQueryParamProvider from '@/hooks/use-application-profile-query-param-provider';
import FetchingQueryParamsProvider from '@/hooks/fetch-query-params-provider';
import SearchQueryParamsProvider from '@/hooks/search-query-params-provider';
import { ThemeConfigProvider } from '@/hooks/theme-provider';
import { GlobalStaticStyles } from '@/lib/emotion/global';
import 'antd/dist/reset.css';
import '../styles/colors.css';
import '../styles/layout-sizes.css';
import '../styles/custom.css';
import '../styles/fonts.css';
import { EntityProvider } from '@/hooks/entity-provider';
import { AuthProvider } from '@/hooks/use-auth';

type AppPageComponent = NextComponentType<NextPageContext, unknown, unknown> & {
  isPopupPage?: boolean;
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const Page = Component as AppPageComponent;
  const page = <Page {...pageProps} />;

  return (
    <GlobalStaticStyles>
      <AuthProvider>
      <InitialHeadlinesProvider>
        <QueryParamProvider adapter={NextAdapter as QueryParamAdapterComponent}>
          <ApplicationProfileQueryParamProvider>
            <FetchingQueryParamsProvider>
              <SearchQueryParamsProvider>
                <HeadlinesProvider>
                  <ThemeConfigProvider>
                    {(themeConfig) => (
                      <NamespaceProvider>
                        <ConfigProvider locale={deDE} theme={themeConfig}>
                          <App>
                            <IsLoadingContextProvider>
                              <CodingsPreferencesProvider>
                                <EntityProvider>
                                  {Page.isPopupPage ? page : <Layout>{page}</Layout>}
                                </EntityProvider>
                              </CodingsPreferencesProvider>
                            </IsLoadingContextProvider>
                          </App>
                        </ConfigProvider>
                      </NamespaceProvider>
                    )}
                  </ThemeConfigProvider>
                </HeadlinesProvider>
              </SearchQueryParamsProvider>
            </FetchingQueryParamsProvider>
          </ApplicationProfileQueryParamProvider>
        </QueryParamProvider>
      </InitialHeadlinesProvider>
      </AuthProvider>
    </GlobalStaticStyles>
  );
};


export default MyApp;