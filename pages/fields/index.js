import fetchWithCache from '../api/fetchWithCache.js'
import FieldList from '../../components/fields/FieldList'
// import sparqlquery from '../../sparql/queryFields'

export default function FieldListPage(props) {
  return (
    <FieldList data={props.rows}/>
  )
}

export async function getStaticProps() {
  const data = await fetchWithCache('https://doku.wikibase.wiki/w/rest.php/gnd/doku/v1/datafields')
  const fields = data.fields
  const rows = []
  Object.keys(fields).map(key => {
    // every field needs a Property ID
    fields[key]['id'] = key
    rows.push(fields[key])
  })
  return {
    props: {
      rows: rows,
      fields: fields
    },
    revalidate: 1000
  }
}
