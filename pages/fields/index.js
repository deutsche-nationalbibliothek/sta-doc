import { getFields } from '@/lib/api'
import FieldList from '../../components/fields/FieldList'
// import sparqlquery from '../../sparql/queryFields'

export default function FieldListPage(props) {
  return (
    <FieldList data={props.rows}/>
  )
}

export async function getStaticProps() {
  const rows = await getFields()
  return {
    props: {
      rows: rows
    },
    revalidate: 1000
  }
}
