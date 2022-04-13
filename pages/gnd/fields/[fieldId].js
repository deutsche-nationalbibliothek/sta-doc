import Head from 'next/head'
import Layout from '@/components/layout/layout'
import Sidebar from '@/components/sidebar/sidebar'
import * as sparql from '@/lib/sparql'
import { getElements, getField, getEntity } from '@/lib/api'
import FieldDetail from '@/components/fields/FieldDetail'

export default function Field({ field }) {
  console.log('field', field)
  const title = field.label && field.description ? field.label + ' | ' + field.description.replace(/ .*/,'') : 'missing german entity label'
  return(
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <FieldDetail data={field}/>
    </>
  )
}

export async function getStaticProps({ params }) {
  // get API data
  const fieldId = params.fieldId
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
  const fields = await getElements( sparql.FIELDS )
  return {
    paths: Object.keys(fields).map((id) => ({params: { fieldId: id.toString() }})),
    fallback: false
  }
}

Field.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
