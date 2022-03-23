import Layout from '@/components/layout/layout'
import Sidebar from '@/components/sidebar/sidebar'

export default function Content() {
  return (
    <section>
      <h1>Inhaltserschließung</h1>
      <p>Kontent</p>
      <p>Kontent</p>
    </section>
  )
}

Content.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
