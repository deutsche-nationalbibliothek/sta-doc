import '../styles/globals.less';
import type { AppProps } from 'next/app';
import HeadlinesProvider from '@/hooks/headlines';
import Layout from '@/components/layout';
import IsLoadingContextProvider from '@/hooks/use-loading-state';
import { CodingsPreferencesProvider } from '@/hooks/use-codings-preference';
import { DataSourceProvider } from '@/hooks/use-pagetype';
import { ConfigProvider } from 'antd';
import deDE from 'antd/lib/locale/de_DE';
import InitialHeadlinesProvider from '@/hooks/initial-headlines';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ConfigProvider locale={deDE}>
        <DataSourceProvider>
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
        </DataSourceProvider>
      </ConfigProvider>
    </>
  );
}
