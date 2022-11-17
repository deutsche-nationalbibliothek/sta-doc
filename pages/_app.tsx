import '../styles/globals.less';
import type { AppProps } from 'next/app';
import HeadlinesProvider from 'hooks/headlines';
import Layout from '@/components/layout';
import IsLoadingContextProvider from '@/hooks/use-loading-state';
import { CodingsPreferencesProvider } from '@/hooks/use-codings-preference';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeadlinesProvider>
        <IsLoadingContextProvider>
          <CodingsPreferencesProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </CodingsPreferencesProvider>
        </IsLoadingContextProvider>
      </HeadlinesProvider>
    </>
  );
}
