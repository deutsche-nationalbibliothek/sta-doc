import Layout from '@/components/layout/layout'
import Sidebar from '@/components/sidebar/sidebar'

export default function About() {
  return (
    <section>
      <h1>Allgemeine Einführung</h1>
      <hr/>
      <p>Kontent</p>
      <p>Kontent</p>
    </section>
  )
}

About.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
