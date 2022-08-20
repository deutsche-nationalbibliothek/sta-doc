import Head from "next/head";
import Layout from "@/components/layout/layout";
import { Item } from "@/types/item";
import Sidebar from "@/components/sidebar/sidebar";
import labelen from "@/data/labelen.json";
import * as sparql from "@/lib/sparql";
import { getElements, readLabelEn, getEntity } from "@/lib/api";
import TopNavigation from "@/components/layout/topNavigation";
import Details from "@/components/details";

export default function Entry({ entry }) {
  const title =
    entry.label && entry.statements.elementof
      ? entry.label + " | " + entry.statements.elementof.occurrences[0].label
      : "missing german entity label";
  const ressourceTypePage =
    entry.statements.elements &&
    entry.statements.elementof.occurrences[0].id === Item["rda-ressourcetype"];
  console.log("id", entry.id, entry.label);

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
          ressourceTypePage={ressourceTypePage}
        />
      </section>
    </>
  );
}

export async function getStaticProps({ params }) {
  // get API data
  const entryId = params.entryId;
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

export async function getStaticPaths() {
  // const entrys = await getElements(sparql.ENTRIES);
  const entries = await readLabelEn(labelen);
  return {
    paths: Object.keys(entries).map((id) => ({
      params: { entryId: id.toString() },
    })),
    fallback: true,
  };
}

Entry.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar active={page} />
      {page}
    </Layout>
  );
};
