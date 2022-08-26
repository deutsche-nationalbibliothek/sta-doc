import Link from "next/link";

export default function RdaNavigation() {
  return (
    <topmenu>
      <nav className={"rda-color"}>
        <p>Formalerschließung [ </p>
        <Link href="/entries/Q8566">Allgemeines</Link>
        <p> | </p>
        <Link href="/entries/Q8477">Erfassungsmethoden</Link>
        <p> | </p>
        <Link href="/rda/properties">Elemente</Link>
        <p> | </p>
        <Link href="/entries/Q8567">Ressourcentypen</Link>
        <p> | </p>
        <Link href="/entries/Q8568">Anwendungsprofile</Link>
        <p> ] </p>
      </nav>
    </topmenu>
  );
}
// <li>
// <Link href='/new-meetup'>Formvorlage(Demo)</Link>
// </li>
