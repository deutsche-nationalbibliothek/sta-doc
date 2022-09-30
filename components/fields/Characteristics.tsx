import Link from "next/link";
import { Fragment } from "react";
import classes from "./Characteristics.module.css";

const ROUTE_GENERAL_ID = "general/[generalId]";

export default function Characteristics({ characteristics }) {
  // console.log('carac',characteristics)
  if (characteristics) {
    return (
      <>
        <h5 className={classes.h5}>{characteristics.label}</h5>
        <ul>
          {characteristics.occurrences.map((value, index) => (
            <li key={index}>
              <Link href={`/general/${encodeURIComponent(value.id)}`}>
                <a>{value.label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  }
}
// <Link
// href={{
// pathname: '/general/[generalId]',
// query: { generalId: value.id },
// }}
// >
// </Link>
