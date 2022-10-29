import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/lib/components/layout';
import HeadlinesProvider from 'hooks/headlines';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeadlinesProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </HeadlinesProvider>
    </>
  );
}
