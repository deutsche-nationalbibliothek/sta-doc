import {AppProps} from 'next/app';
import AnchorProvider from '../context/anchors';

import '@/styles/globals.css';
import 'devextreme/dist/css/dx.light.css';

export default function MyApp({Component, pageProps}: AppProps) {
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);

  return (
    <AnchorProvider>{getLayout(<Component {...pageProps} />)}</AnchorProvider>
  );
}
