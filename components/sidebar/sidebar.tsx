import Link from "next/link";
import { useAnchor } from "../../context/anchors";
import { useRouter } from "next/router";
import { Item } from "@/types/item";
import ListOfContent from "./listOfContent";
import TOC from "../toc/toc";
import styles from "./sidebar.module.css";

export default function Sidebar({ active }) {
  const router = useRouter();
  const { anchors } = useAnchor();
  const schema = active?.props?.entry?.statements?.schema?.occurrences[0].id;
  const elementOf =
    active?.props?.entry?.statements?.elementof?.occurrences[0].id;

  return (
    <>
      <nav className={styles.nav}>
        <h3>DACH.dokumente</h3>
        <input className={styles.input} placeholder="Search..." />
        <Link href={`/`}>
          <a
            className={
              router.pathname == "/" ? `${styles.home}` : `${styles.navButtons}`
            }
          >
            Willkommen
          </a>
        </Link>
        <Link href={"/about"}>
          <a
            className={
              router.pathname == "/about"
                ? `${styles.home}`
                : `${styles.navButtons}`
            }
          >
            allgemeine Einführung
          </a>
        </Link>
        <Link href={"/rda"}>
          <a
            className={
              router.pathname.startsWith("/rda") ||
                schema === Item["rda-documentation"] ||
                elementOf === Item.rdaproperty ||
                elementOf === Item["stadocumentation:rules"] ||
                elementOf === Item.rdaguidance
                ? `${styles.rda}`
                : `${styles.navButtons}`
            }
          >
            Handbuch Erschließung
          </a>
        </Link>
        {/* {elementOf === Item.rdaproperty && <ListOfContent anchors={anchors} />} */}
        {schema === Item["rda-documentation"] && <TOC />}
        <Link href={"/gnd"}>
          <a
            className={
              router.pathname.startsWith("/gnd") ||
                elementOf === Item.gnddatafield ||
                elementOf === Item.gndsubfield
                ? `${styles.gnd}`
                : `${styles.navButtons}`
            }
          >
            Handbuch GND
          </a>
        </Link>
        {schema === Item.gnddatamodel && <TOC />}
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </nav>
    </>
  );
}
