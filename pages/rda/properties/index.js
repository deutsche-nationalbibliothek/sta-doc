import Head from 'next/head'
import * as sparql from '@/lib/sparql'
import { getRdaProperties } from '@/lib/api'
import FieldList from '@/components/fields/FieldList'

export default function RdaPropertiesPage({ list }) {
  return (
    <>
      <Head>
        <title>RDA Elemente</title>
      </Head>
      <h1>RDA Elemente</h1>
      <FieldList data={list}/>
    </>
  )
}

export async function getStaticProps() {
  const list = await getRdaProperties()
  // console.log('list',list)
  return {
    props: {
      list: [ ...list ]
    },
    revalidate: 1000
  }
}
