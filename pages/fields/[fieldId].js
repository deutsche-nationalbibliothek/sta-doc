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
  const fieldId = params.fieldId
  const field = await getField(fieldId)
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
    paths: Object.keys(fields).map((id) => ({params: { fieldId: id.toString() }})) || [],
    fallback: true
  }
}
