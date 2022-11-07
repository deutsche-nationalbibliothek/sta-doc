import '../styles/globals.less';
import type { AppProps } from 'next/app';
import HeadlinesProvider from 'hooks/headlines';
import Layout from '@/components/layout';
import CurrentHeadlinesPathProvider from '@/hooks/current-headline-path';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeadlinesProvider>
        <CurrentHeadlinesPathProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CurrentHeadlinesPathProvider>
      </HeadlinesProvider>
    </>
  );
}
