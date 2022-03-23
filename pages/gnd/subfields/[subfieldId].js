import * as sparql from '@/lib/sparql'
import { getElements, getField } from '@/lib/api'
import FieldDetail from '@/components/fields/FieldDetail'

export default function FieldDetails({ field }) {
  // console.log('field', field)
  return(
    <FieldDetail data={field}/>
  )
}

export async function getStaticProps({ params }) {
  // get API data
  const fieldId = params.subfieldId
  const field = await getField(fieldId)
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
