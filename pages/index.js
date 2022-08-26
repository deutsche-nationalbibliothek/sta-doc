import Head from "next/head";
import Layout from "@/components/layout/layout";
import Sidebar from "@/components/sidebar/sidebar";

export default function HomePage(props) {
  return (
    <>
      <Head>
        <title>DACH Dokumentationsplattform</title>
      </Head>
      <section>
        <h1>DACH Dokumentationsplattform</h1>
        <hr />
        <p>Herzlich willkommen!</p>
      </section>
    </>
  );
}

export async function getStaticProps() {
  const url =
    "https://doku.wikibase.wiki/api.php?" +
    new URLSearchParams({
      origin: "*",
      action: "parse",
      page: "GND-Dokumentation",
      prop: "text",
      format: "json",
    });
  const req = await fetch(url);
  const json = await req.json();
  const parser = json.parse.text["*"];
  const title = json.parse.title;

  return {
    props: {
      parser: parser,
      json: json,
      title: title,
    },
    revalidate: 10,
  };
}

HomePage.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar active={page} />
      {page}
    </Layout>
  );
};
