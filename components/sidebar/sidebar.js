import Link from "next/link";
import { useAnchor } from "../../context/anchors";
import { useRouter } from "next/router";
import { Item } from "@/types/item";
import styles from "./sidebar.module.css";
// import GeneralDetail from '@/components/general/GeneralDetail'

export default function Sidebar({ active }) {
  const router = useRouter();
  const { anchors } = useAnchor();
  const elementOf =
    active?.props?.field?.statements?.elementof?.occurrences[0].id;

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
              elementOf === Item.rdaproperty
                ? `${styles.rda}`
                : `${styles.navButtons}`
            }
          >
            Handbuch Erschließung
          </a>
        </Link>
        {/* <Link href={"/content"}> */}
        {/*   <a */}
        {/*     className={ */}
        {/*       router.pathname.startsWith("/content") */}
        {/*         ? `${styles.content}` */}
        {/*         : `${styles.navButtons}` */}
        {/*     } */}
        {/*   > */}
        {/*     Handbuch Inhaltserschließung */}
        {/*   </a> */}
        {/* </Link> */}
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
      </nav>
      {anchors.map((a) => (
        <p style={{ display: "none" }}>
          {a.label}-{a.id}
        </p>
      ))}
    </>
  );
}
