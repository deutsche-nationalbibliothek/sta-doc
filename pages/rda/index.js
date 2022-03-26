import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/layout/layout'
import Sidebar from '@/components/sidebar/sidebar'
import RdaNavigation from '@/components/layout/RdaNavigation'
import Collapsible from 'react-collapsible'
import stylesCollapsible from '@/styles/RdaCollapsible.module.css'

export default function Rda() {
  return (
    <>
      <Head>
        <title>Handbuch Formalerschließung (RDA) - Startseite</title>
      </Head>
      <section>
        <RdaNavigation />
        <div>
          <h1>
            <span>
              <Image 
                alt="<<<RDA LOGO>>>" 
                src="https://www.cilip.org.uk/resource/resmgr/cilip/facet/a-rda-logo-small-300dpi.jpg" 
                width={255} 
                height={107} 
              />
            </span>
            Handbuch Formalerschließung - Bibliothekarische Formalerschließung gemäß RDA
          </h1>
        </div>
        <hr/>
        <section>
          <h2>Einleitung, Ziele des Regelwerks, Grundprinzipien</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </section>
        <section>
          <h3>Allgemeine Konzepte der Formalerschließung</h3>
          <Collapsible
            trigger='Öffne Liste' 
            triggerWhenOpen='Schließe Liste'
            ClassName={stylesCollapsible.Collapsible}
            triggerClassName={stylesCollapsible.CustomTriggerCSS}
            triggerOpenedClassName={stylesCollapsible.CustomTriggerCSSopen}
          >
            <ul>
              <li>Abgrenzung unterschiedlicher Erscheinungsweisen</li>
              <li>Beziehungen</li>
              <li>Datumsangaben</li>
              <li>Erfassungsmethoden</li>
              <li>Informationsquellen</li>
              <li>Übertragen</li>
              <li>Neue Beschreibung erforderlich</li>
              <li>Zusammengesetzte Beschreibung</li>
            </ul>
          </Collapsible>
          <h3>Allgemeines zu RDA-Entitäten</h3>
          <Collapsible
            trigger='Öffne Liste' 
            triggerWhenOpen='Schließe Liste'
            ClassName={stylesCollapsible.Collapsible}
            triggerClassName={stylesCollapsible.CustomTriggerCSS}
            triggerOpenedClassName={stylesCollapsible.CustomTriggerCSSopen}
          >
            <ul>
              <li>Expression</li>
              <li>Manifestation</li>
              <li>Exemplar</li>
              <li>Akteure</li>
              <ul>
                <li>Person</li>
                <li>Familie</li>
                <li>Körperschaft</li>
              </ul>
              <li>Geografikum</li>
            </ul>
          </Collapsible>
          <h3>Beschreibungen der RDA-Elemente</h3>
          <Collapsible
            trigger='Öffne Liste' 
            triggerWhenOpen='Schließe Liste'
            ClassName={stylesCollapsible.Collapsible}
            triggerClassName={stylesCollapsible.CustomTriggerCSS}
            triggerOpenedClassName={stylesCollapsible.CustomTriggerCSSopen}
          >
            <ul>
              <li>Werkebene</li>
              <li>Expressionsebene</li>
              <li>Manifestationsebene</li>
              <li>Exemplarebene</li>
            </ul>
          </Collapsible>
          <h3>Anwendungsprofile</h3>
          <Collapsible
            trigger='Öffne Liste' 
            triggerWhenOpen='Schließe Liste'
            ClassName={stylesCollapsible.Collapsible}
            triggerClassName={stylesCollapsible.CustomTriggerCSS}
            triggerOpenedClassName={stylesCollapsible.CustomTriggerCSSopen}
          >
            <ul>
              <li></li>
              <li></li>
            </ul>
          </Collapsible>
        </section>
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
