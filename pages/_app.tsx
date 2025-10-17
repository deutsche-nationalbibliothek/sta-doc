// import '../styles/globals.less';
import type { AppProps } from 'next/app';
import HeadlinesProvider from '@/hooks/headlines';
import Layout from '@/components/layout';
import IsLoadingContextProvider from '@/hooks/use-loading-state';
import { CodingsPreferencesProvider } from '@/hooks/use-codings-preference';
import { NamespaceProvider } from '@/hooks/use-namespace';
import { ConfigProvider } from 'antd';
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
import '../styles/colors.css';
import '../styles/layout-sizes.css';
import '../styles/custom.css';
import '../styles/fonts.css';
import '../styles/editor.css';
import { EntityProvider } from '@/hooks/entity-provider';
import { EditorProvider } from '@/features/editor/hooks/use-editor-state';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const AppContent = (
    <GlobalStaticStyles>
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
                          <IsLoadingContextProvider>
                            <CodingsPreferencesProvider>
                              <EntityProvider>
                                <Layout>
                                  <Component {...pageProps} />
                                </Layout>
                              </EntityProvider>
                            </CodingsPreferencesProvider>
                          </IsLoadingContextProvider>
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
    </GlobalStaticStyles>
  );

  // Editor Provider nur hinzufügen wenn Editor aktiviert ist
  if (process.env.NEXT_PUBLIC_EDITOR_ENABLED === 'true') {
    return (
      <EditorProvider>
        {AppContent}
      </EditorProvider>
    );
  }

  return AppContent;
};


export default MyApp;