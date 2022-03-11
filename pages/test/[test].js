import { getCodings, getElements } from '@/lib/api'
import * as sparql from '@/lib/sparql'


export default function Test({ codings, labelDe, labelEn }) {
  console.log('codings',codings)
  console.log('labelDe',labelDe)
  console.log('labelEn',labelEn)
  return(
    <h1>Hello World!</h1>
  )
}

export async function getStaticProps({ params }) {
  // get API data
  const codings = await getCodings(sparql.CODINGS)
  const labelDe = await getElements(sparql.LABELDE)
  const labelEn = await getElements(sparql.LABELEN)

  return {
    props: {
      codings: { ...codings },
      labelDe: { ...labelDe },
      labelEn: { ...labelEn },
    },
    revalidate: 10
  }
}
export async function getStaticPaths() {
  const codings = await getCodings( sparql.CODINGS )
  return {
    paths: Object.keys(codings).map((id) => ({params: { test: id.toString() }})) || [],
    fallback: true
  }

}
