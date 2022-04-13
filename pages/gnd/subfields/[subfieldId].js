import * as sparql from '@/lib/sparql'
import { getElements, getEntity } from '@/lib/api'
import FieldDetail from '@/components/fields/FieldDetail'

export default function FieldDetails({ field }) {
  // console.log('field', field)
  if(field === undefined) {
    return(<p>entity has no statements.</p>)
  } else {
  return(
    <FieldDetail data={field}/>
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
