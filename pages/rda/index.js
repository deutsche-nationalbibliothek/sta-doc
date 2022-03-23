import Head from 'next/head'
import Layout from '@/components/layout/layout'
import Sidebar from '@/components/sidebar/sidebar'

export default function Rda() {
  return (
    <>
      <Head>
        <title>Handbuch Formalerschließung - Bibliothekarische Formalerschließung gemäß RDA</title>
      </Head>
      <section>
        <h1>
          <span>
            <img src="https://www.cilip.org.uk/resource/resmgr/cilip/facet/a-rda-logo-small-300dpi.jpg" width="200"/>
          </span>
          Handbuch Formalerschließung - Bibliothekarische Formalerschließung gemäß RDA
        </h1>
        <div>
          <h2>Einleitung, Ziele des Regelwerks, Grundprinzipien</h2>
        </div>
      </section>
    </>
  )
}

Rda.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
