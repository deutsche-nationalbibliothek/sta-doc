import { Statement } from "@/types/entity";
import { Item } from "@/types/item";
import { Property } from "@/types/property";
import Link from "next/link";
import React from "react";
import Examples from "../fields/Examples";
import SubFields from "../fields/SubFields";
import styles from "../general/GeneralDetail.module.css";
import Header from "../layout/header";
import Occurance from "./occurance";

interface Props {
  statement: Statement;
  headerLevel: number;
  index: number;
}

export default function StatementComp({
  statement,
  headerLevel,
  index,
}: Props) {
  // const unorderdList = () =>
  //   (statement.occurrences as any).filter(
  //     (occ: any) =>
  //       occ.qualifiers?.typeoflayout &&
  //       occ.qualifiers.typeoflayout.occurrences[0].id ===
  //       Item["enumeration,uncounted"]
  //   );

  // const renderStatements = {
  //   ...statement,
  //   [Item["enumeration,counted"]]: (statement.occurrences as any).filter(
  //     (occ: any) =>
  //       occ.qualifiers?.typeoflayout &&
  //       occ.qualifiers.typeoflayout.occurrences[0].id ===
  //         Item["enumeration,uncounted"]
  //   ),
  // };

  const showHeadline = statement.id !== Property.description;

  return (
    <>
      {showHeadline && (
        <Header label={statement.label} id={statement.id} level={headerLevel} />
      )}

      {statement.id === Property.subfields && (
        <SubFields key={statement.id} {...statement} />
      )}

      {statement.id === Property.examples && <Examples examples={statement} />}

      {(statement.id === Property["embeddedin(property)"] ||
        statement.id === Property["embeddedin(item)"]) &&
        statement.occurrences.map((occ: any) => (
          <p key={occ.id} className={styles.bold}>
            eingebettet in: &rArr;&ensp;
            {/* todo, fix || '#' */}
            <Link href={occ.link || "#"}>
              <a>{occ.label}</a>
            </Link>
          </p>
        ))}

      {statement.occurrences.map((occ: any, index: any) => (
        <Occurance
          key={occ.id}
          occurance={occ}
          headerLevel={headerLevel + (showHeadline ? 1 : 0)}
          index={index}
          statement={statement}
        />
      ))}
    </>
  );
}
