import '../styles/globals.less';
import type { AppProps } from 'next/app';
import HeadlinesProvider from 'hooks/headlines';
import Layout from '@/components/layout';
import IsLoadingContextProvider from '@/hooks/use-loading-state';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeadlinesProvider>
        <IsLoadingContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </IsLoadingContextProvider>
      </HeadlinesProvider>
    </>
  );
}
