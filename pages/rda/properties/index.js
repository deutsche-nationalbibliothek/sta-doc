import Layout from '@/components/layout/layout'
import Sidebar from '@/components/sidebar/sidebar'
import Head from 'next/head'
import * as sparql from '@/lib/sparql'
import { getRdaProperties } from '@/lib/api'
import RdaTable from '@/components/tables/RdaTable'

export default function RdaPropertiesPage({ list }) {
  console.log('list',list)
  return (
    <>
      <Head>
        <title>RDA Eigenschaften</title>
      </Head>
      <section>
        <h1>RDA Eigenschaften</h1>
        <RdaTable data={list}/>
      </section>
    </>
  )
}
      // <FieldList data={list}/>

export async function getStaticProps() {
  const list = await getRdaProperties()
  return {
    props: {
      list: [ ...list ]
    },
    revalidate: 1000
  }
}

RdaPropertiesPage.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
