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
import { QueryParamProvider } from 'use-query-params';
import ApplicationProfileQueryParamProvider from '@/hooks/use-application-profile-query-param-provider';
import FetchingQueryParamsProvider from '@/hooks/fetch-query-params-provider';
import SearchQueryParamsProvider from '@/hooks/search-query-params-provider';
import 'antd/dist/antd.variable.min.css';

export default function App({ Component, pageProps }: AppProps) {
  ConfigProvider.config({
    theme: {
      primaryColor: `#FDD069`,
    },
  });
  return (
    <>
      <ConfigProvider locale={deDE}>
        <QueryParamProvider adapter={NextAdapter}>
          <ApplicationProfileQueryParamProvider>
            <FetchingQueryParamsProvider>
              <SearchQueryParamsProvider>
                <NamespaceProvider>
                  <InitialHeadlinesProvider>
                    <HeadlinesProvider>
                      <IsLoadingContextProvider>
                        <CodingsPreferencesProvider>
                          <Layout>
                            <Component {...pageProps} />
                          </Layout>
                        </CodingsPreferencesProvider>
                      </IsLoadingContextProvider>
                    </HeadlinesProvider>
                  </InitialHeadlinesProvider>
                </NamespaceProvider>
              </SearchQueryParamsProvider>
            </FetchingQueryParamsProvider>
          </ApplicationProfileQueryParamProvider>
        </QueryParamProvider>
      </ConfigProvider>
    </>
  );
}
