import Head from "next/head";
import Layout from "@/components/layout/layout";
import { Item } from "@/types/item";
import Sidebar from "@/components/sidebar/sidebar";
import * as sparql from "@/lib/sparql";
import { getElements, sortStatements, getEntity } from "@/lib/api";
import TopNavigation from "@/components/layout/topNavigation";
// import GeneralDetail from "@/components/general/GeneralDetail";
import Details from "@/components/details";

export default function Entry({ entry }) {
  const title =
    entry.label && entry.statements.elementof
      ? entry.label + " | " + entry.statements.elementof.occurrences[0].label
      : "missing german entity label";
  const ressourceTypePage =
    entry.statements.elements &&
    entry.statements.elementof.occurrences[0].id === Item["rda-ressourcetype"];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <TopNavigation entry={entry} />
      <section className={"entry-content"}>
        {/* todo, sortStatements in api call */}
        <Details
          entity={{
            ...entry,
            statements: sortStatements(entry.statements),
          }}
          ressourceTypePage={ressourceTypePage}
        />
      </section>
    </>
  );
}

export async function getServerSideProps({ params, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=100, stale-while-revalidate=100"
  );
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
  };
}

// export async function getStaticProps({ params }) {
//   // get API data
//   const entryId = params.entryId;
//   const entry = await getEntity(entryId);

//   if (!entry) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       entry: { ...entry },
//     },
//   };
// }

// export async function getStaticPaths() {
//   const entrys = await getElements(sparql.ENTRIES);
//   return {
//     paths: Object.keys(entrys).map((id) => ({
//       params: { entryId: id.toString() },
//     })),
//     fallback: true,
//   };
// }

Entry.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar active={page} />
      {page}
    </Layout>
  );
};
