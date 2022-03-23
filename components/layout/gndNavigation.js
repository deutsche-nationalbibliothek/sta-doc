import Link from 'next/link'
import styles from './gndNavigation.module.css'

export default function GndNavigation() {

  return (
    <header className={styles.header}>
      <div className={styles.logo}></div>
      <nav>
        <ul>
          <li>
            <Link href='/gnd/fields'>Feldverzeichnis</Link>
          </li>
          <li>
            <Link href='/gnd/codes'>Entitätencodeliste</Link>
          </li>
          <li>
            <Link href='/new-meetup'>Formvorlage(Demo)</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
