import '../styles/globals.less';
import type { AppProps } from 'next/app';
import HeadlinesProvider from '@/hooks/use-headlines';
import Layout from '@/components/layout';
import IsLoadingContextProvider from '@/hooks/use-loading-state';
import { CodingsPreferencesProvider } from '@/hooks/use-codings-preference';
import { PageTypeProvider } from '@/hooks/use-pagetype';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeadlinesProvider>
        <IsLoadingContextProvider>
          <PageTypeProvider>
            <CodingsPreferencesProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </CodingsPreferencesProvider>
          </PageTypeProvider>
        </IsLoadingContextProvider>
      </HeadlinesProvider>
    </>
  );
}
