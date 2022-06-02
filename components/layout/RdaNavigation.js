import Link from "next/link";

export default function RdaNavigation() {
  return (
    <topmenu>
      <nav className={"rda-color"}>
        <Link href="/rda/properties">RDA-Elemente</Link>
      </nav>
    </topmenu>
  );
}
// <li>
// <Link href='/new-meetup'>Formvorlage(Demo)</Link>
// </li>
