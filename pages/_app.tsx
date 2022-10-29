import '../styles/globals.css';
import type { AppProps } from 'next/app';
import HeadlinesProvider from 'hooks/headlines';
import Layout from '@/components/layout';

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
