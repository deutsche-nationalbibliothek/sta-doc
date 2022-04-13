import Layout from '@/components/layout/layout'
import Sidebar from '@/components/sidebar/sidebar'
import Head from 'next/head'
import * as sparql from '@/lib/sparql'
import { getRdaProperties } from '@/lib/api'
import RdaNavigation from '@/components/layout/RdaNavigation'
import RdaTable from '@/components/tables/RdaTable'

export default function RdaPropertiesPage({ list }) {
  return (
    <>
      <Head>
        <title>RDA Eigenschaften</title>
      </Head>
      <section>
        <RdaNavigation/>
        <h1>RDA Eigenschaften</h1>
        <RdaTable data={list}/>
      </section>
    </>
  )
}

export async function getStaticProps() {
  const list = await getRdaProperties()
  return {
    props: {
      list: [ ...list ]
    },
    revalidate: 10
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
