import Head from 'next/head'
import Layout from '@/components/layout/layout'
import Sidebar from '@/components/sidebar/sidebar'
import GndNavigation from '@/components/layout/gndNavigation'
import * as sparql from '@/lib/sparql'
import { getElements, getEntity } from '@/lib/api'
import FieldDetail from '@/components/fields/FieldDetail'

export default function FieldDetails({ field }) {
  // console.log('field', field)
  if(field === undefined) {
    return(<p>entity has no statements.</p>)
  } else {
  const title = field.label && field.description ? field.label + ' | ' + field.description.replace(/ .*/,'') : 'missing german entity label'
  return(
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <section>
        <GndNavigation />
        <FieldDetail data={field}/>
      </section>
    </>
  )}
}

export async function getStaticProps({ params }) {
  // get API data
  const fieldId = params.subfieldId
  const field = await getEntity(fieldId)

  if (!field) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      field: { ...field }
    },
    revalidate: 100
  }
}

export async function getStaticPaths() {
  const fields = await getElements( sparql.SUBFIELDS )
  return {
    paths: Object.keys(fields).map((id) => ({params: { subfieldId: id.toString() }})) || [],
    fallback: true
  }
}

FieldDetails.getLayout = function getLayout(page) {
  const focusPage = 'gnd'
  return (
    <Layout>
      <Sidebar focusPage={focusPage} />
      {page}
    </Layout>
  )
}
