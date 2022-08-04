import Head from "next/head";
import Layout from "@/components/layout/layout";
import { Item } from "@/types/item";
import { Property } from "@/types/property";
import Sidebar from "@/components/sidebar/sidebar";
import * as sparql from "@/lib/sparql";
import { getElements, sortStatements, getEntity } from "@/lib/api";
import TopNavigation from "@/components/layout/topNavigation";
// import GeneralDetail from "@/components/general/GeneralDetail";
import Details from "@/components/details";

export default function Entry({ field }) {
  const title =
    field.label && field.statements.elementof
      ? field.label + " | " + field.statements.elementof.occurrences[0].label
      : "missing german entity label";
  const ressourceTypePage =
    field.statements.elements &&
    field.statements.elementof.occurrences[0].id === Item["rda-ressourcetype"];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <TopNavigation field={field} />
      <section className={"entry-content"}>
        {/* todo, sortStatements in api call */}
        <Details
          entity={{
            ...field,
            statements: sortStatements(field.statements),
          }}
          ressourceTypePage={ressourceTypePage}
        />
      </section>
    </>
  );
}

export async function getStaticProps({ params }) {
  // get API data
  const fieldId = params.entryId;
  // const field = await getField(fieldId)
  const field = await getEntity(fieldId);

  if (!field) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      field: { ...field },
    },
    // revalidate: 100
  };
}

export async function getStaticPaths() {
  const fields = await getElements(sparql.ENTRIES);
  return {
    paths: Object.keys(fields).map((id) => ({
      params: { entryId: id.toString() },
    })),
    fallback: false,
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
