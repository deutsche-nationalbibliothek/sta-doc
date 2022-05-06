import { useState } from 'react';
import Head from 'next/head'
import Layout from '@/components/layout/layout'
import Sidebar from '@/components/sidebar/sidebar'
import * as sparql from '@/lib/sparql'
import { getElements, getField, getEntity } from '@/lib/api'
import RdaNavigation from '@/components/layout/RdaNavigation'
import FieldDetail from '@/components/fields/FieldDetail'
import GeneralDetail from '@/components/general/GeneralDetail'

export default function Property({ field }) {
  // console.log('entity',field)
  const title = field.label && field.description ? field.label + ' | ' + field.description.replace(/ .*/,'') : 'missing german entity label'

  return(
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <RdaNavigation/>
      <section>
        <GeneralDetail data={field}/>
      </section>
    </>
  )
}

export async function getStaticProps({ params }) {
  // get API data
  const fieldId = params.propertyId
  // const field = await getField(fieldId)
  const field = await getEntity(fieldId)

  if (!field) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      field: { ...field }
    },
    // revalidate: 100
  }
}

export async function getStaticPaths() {
  const fields = await getElements( sparql.RDAPROPERTIES )
  return {
    paths: Object.keys(fields).map((id) => ({params: { propertyId: id.toString() }})),
    fallback: false
  }
}

Property.getLayout = function getLayout(page) {
  console.log('pagee',page)
  return (
    <Layout>
      <Sidebar active={page}/>
      {page}
    </Layout>
  )
}
