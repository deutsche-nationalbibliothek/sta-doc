import FieldList from '../../components/fields/FieldList'

function FieldListPage(props) {
  console.log('fields',props.fields)
  return (
    <FieldList data={props.rows}/>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://doku.wikibase.wiki/w/rest.php/gnd/doku/v1/datafields')
  const data = await res.json()
  const fields = data.fields
  const rows = []
  Object.keys(fields).map(key => {
    // every field needs a Property ID
    fields[key]['id'] = key
    rows.push(fields[key])
    // console.log('rows',rows)
    // console.log(fields[key])
    // console.log('key',key)
  })
  return {
    props: {
      rows: rows,
      fields: fields
    },
    revalidate: 1000
  }

}

export default FieldListPage
