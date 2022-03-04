import fetchWithCache from '../../api/fetchWithCache.js'
import queryElements from '../../../sparql/queryElements'
import queryField from '../../../wikibase/queryField'
import * as constants from '../../../sparql/queryConstants'
import FieldDetail from '../../../components/fields/FieldDetail'

export default function FieldDetails(props) {
  const field = props.field
  console.log('field', field)
  // console.log('api_data', props.api_data)
  return(
    <FieldDetail data={props.field}/>
  )
}

export async function getStaticPaths() {
  const fields = await queryElements( constants.QUERYSUBFIELDS )
  // const res = await fetch('http://localhost:3000/api/subfields')
  // const data = await res.json()
  // const fields = data
  const rows = []
  Object.keys(fields).map(key => {
    rows.push(key)
    // console.log('rows',rows)
  })
  return {
    fallback: false,
    paths: rows.map((id) => ({
      params: { subfieldId: id.toString() }
    }))
  }
}

export async function getStaticProps(context) {
  //fetch data for a single field
  const subfieldId = context.params.subfieldId
  // const api_url = 'http://localhost:3000/api/subfields/'
  // const api_url = 'http://10.69.59.78:3000/api/subfields/'
  // const api_res = await fetch(api_url + subfieldId)
  // const field = await api_res.json()
  // const field = await fetchWithCache(api_url + subfieldId)
  const field = await queryField(subfieldId)

  return {
    props: {
      field: field
    },
    revalidate: 1000
  }
}
