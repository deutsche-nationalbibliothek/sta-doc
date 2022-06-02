import Head from "next/head";
import Image from "next/image";
import Layout from "@/components/layout/layout";
import Sidebar from "@/components/sidebar/sidebar";
import GndNavigation from "@/components/layout/gndNavigation";
import gndLogo from "@/public/GND_RGB_Wabe.png";

export default function GNDHomePage(props) {
  const image =
    "https://doku.wikibase.wiki/w/thumb.php?f=GND_RGB.jpg&width=200";
  const htmlparser2 = require("htmlparser2");
  const json = props.json;
  const dom = htmlparser2.parseDocument(props.parser);
  const htmlString = props.parser;
  const title = props.title;
  const tag_list = [];
  dom.children[0].children.map((element) => {
    if (element["type"] === "tag") {
      tag_list.push(element);
    }
  });

  return (
    <>
      <Head>
        <title>Handbuch Gemeinsame Normdatei</title>
      </Head>
      <GndNavigation />
      <section>
        <h1>
          <span>
            <Image
              src={gndLogo}
              alt="<<<GND LOGO>>>"
              width={0.5 * 252}
              height={0.5 * 291}
            />
          </span>
          Handbuch Gemeinsame Normdatei
        </h1>

        <hr />
        <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>
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

GNDHomePage.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar active={page} />
      {page}
    </Layout>
  );
};
