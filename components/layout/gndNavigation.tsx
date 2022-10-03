import Link from 'next/link';

export default function GndNavigation() {
  return (
    <topmenu>
      <nav className={'gnd-color'}>
        <Link href="/gnd/fields">Datenfelder</Link>
        {/* <Link href="/gnd/codes">Relationencodes</Link> */}
      </nav>
    </topmenu>
  );
}
// <li>
// <Link href='/new-meetup'>Formvorlage(Demo)</Link>
// </li>
