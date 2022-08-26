import Head from "next/head";
// import Image from "next/image";
import Layout from "@/components/layout/layout";
import Sidebar from "@/components/sidebar/sidebar";
import TopNavigation from "@/components/layout/topNavigation";
import { getElements, readLabelEn, getEntity } from "@/lib/api";
// import RdaNavigation from "@/components/layout/RdaNavigation";
// import Collapsible from "react-collapsible";
// import stylesCollapsible from "@/styles/RdaCollapsible.module.css";
// import rdaLogo from "@/public/a-rda-logo-small-300dpi.jpg";
import Details from "@/components/details";

export default function Rda({ entry }) {
  const title =
    entry.label && entry.statements.elementof
      ? entry.label + " | " + entry.statements.elementof.occurrences[0].label
      : "missing german entity label";
  // const ressourceTypePage =
  // entry.statements.elements &&
  // entry.statements.elementof.occurrences[0].id === Item["rda-ressourcetype"];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <TopNavigation entry={entry} />
      <section className={"entry-content"}>
        {/* todo, sortStatements in api call */}
        <Details
          entry={{
            ...entry,
          }}
        // ressourceTypePage={ressourceTypePage}
        />
      </section>
    </>
  );
}

export async function getStaticProps() {
  // get API data
  const entryId = "Q8469";
  const entry = await getEntity(entryId);

  if (!entry) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      entry: { ...entry },
    },
    // revalidate: 10, // In seconds
  };
}

Rda.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar active={page} />
      {page}
    </Layout>
  );
};
