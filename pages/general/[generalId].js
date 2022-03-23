import Head from 'next/head'
import * as sparql from '@/lib/sparql'
import { getElements, getField } from '@/lib/api'
import FieldDetail from '@/components/fields/FieldDetail'

export default function FieldDetails({ field }) {
  console.log('field', field)
  const title = field.label + ' | ' + field.description.replace(/ .*/,'')
  return(
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>DEFAULT PAGE</h1>
    </>
  )
}
    // <FieldDetail data={field}/>

export async function getStaticProps({ params }) {
  // get API data
  const id = params.generalId
  const field = await getField(id)
  return {
    props: {
      field: { ...field }
    },
    revalidate: 100
  }
}

export async function getStaticPaths() {
  const fields = await getElements( sparql.LABELEN )
  return {
    paths: Object.keys(fields).map((key) => ({params: { generalId: key.toString() }})) || [],
    fallback: true
  }
}
