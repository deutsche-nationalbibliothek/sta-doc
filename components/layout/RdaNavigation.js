import Link from 'next/link'
import styles from './RdaNavigation.module.css'

export default function RdaNavigation() {

  return (
    <header className={styles.header}>
      <div className={styles.logo}></div>
      <nav>
        <ul>
          <li>
            <Link href='/rda/properties'>RDA-Elemente</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
          // <li>
            // <Link href='/new-meetup'>Formvorlage(Demo)</Link>
          // </li>
