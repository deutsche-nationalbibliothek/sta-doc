import ActiveLink from './ActiveLink'
import styles from './sidebar.module.css'

export default function Sidebar(props) {
  return (
    <>
      <nav className={styles.nav}>
        <h3>DACH.dokumente</h3>
        <input className={styles.input} placeholder="Search..." />
        <ActiveLink activeClassName={styles.home} href="/">
          <a className={styles.navButtons}>Willkommen</a>
        </ActiveLink>
        <ActiveLink activeClassName={styles.home} href="/about">
          <a className={styles.navButtons}>allgemeine Einführung</a>
        </ActiveLink>
        <ActiveLink activeClassName={styles.rda} href="/rda">
          <a className={styles.navButtons}>Handbuch Formalerschließung</a>
        </ActiveLink>
        <ActiveLink activeClassName={styles.content} href="/content">
          <a className={styles.navButtons}>Handbuch Inhaltserschließung</a>
        </ActiveLink>
        <ActiveLink activeClassName={styles.gnd} href="/gnd">
          <a className={styles.navButtons}>Handbuch GND</a>
        </ActiveLink>
      </nav>
    </>
  )
}
