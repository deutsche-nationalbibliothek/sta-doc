import Head from 'next/head'
import * as sparql from '@/lib/sparql'
import { getElements, getField, getEntity } from '@/lib/api'
import GeneralDetail from '@/components/general/GeneralDetail'

export default function GeneralDetails({ field }) {
  // console.log('field', field)
  const title = field.label + ' | ' + field.description.replace(/ .*/,'') + ' (General Page)'
  return(
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <GeneralDetail data={field}/>
    </>
  )
}

export async function getStaticProps({ params }) {
  // get API data
  const id = params.generalId
  // const field = await getField(id)
  const field = await getEntity(id)
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
