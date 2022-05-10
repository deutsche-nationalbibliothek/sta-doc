import Link from "next/link";
import styles from "./RdaNavigation.module.css";

export default function RdaNavigation() {
  return (
    <topmenu>
      <nav>
        <Link href="/rda/properties">RDA-Elemente</Link>
      </nav>
    </topmenu>
  );
}
// <li>
// <Link href='/new-meetup'>Formvorlage(Demo)</Link>
// </li>
