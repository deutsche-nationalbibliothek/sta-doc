import Link from 'next/link'
import classes from './MainNavigation.module.css';

function MainNavigation() {

  return (
    <header className={classes.header}>
      <div className={classes.logo}>GND Dokumentation</div>
      <nav>
        <ul>
          <li>
            <Link href='/'>Feldverzeichnis</Link>
          </li>
          <li>
            <Link href='/new-meetup'>Formvorlage(Demo)</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
