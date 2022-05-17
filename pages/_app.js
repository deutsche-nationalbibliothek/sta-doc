import Layout from "@/components/layout/layout";
import AnchorProvider from "../context/anchors";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AnchorProvider>{getLayout(<Component {...pageProps} />)}</AnchorProvider>
  );
}
// return (
// <Layout>
// <Component {...pageProps} />
// </Layout>
// )
