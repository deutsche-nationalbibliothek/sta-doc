import '../styles/globals.less';
import type { AppProps } from 'next/app';
import HeadlinesProvider from 'hooks/headlines';
import Layout from '@/components/layout';
import CurrentHeadlinesPathProvider from '@/hooks/current-headline-path';
import IsLoadingContextProvider from '@/hooks/use-loading-state';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeadlinesProvider>
        <CurrentHeadlinesPathProvider>
          <IsLoadingContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </IsLoadingContextProvider>
        </CurrentHeadlinesPathProvider>
      </HeadlinesProvider>
    </>
  );
}
