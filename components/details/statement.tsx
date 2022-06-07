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
  function reduceStatementOccurrences(statement) {
    // TODO try the reduce arr method to rearrange the occurrences array
    // const initialOcc = [];
    // const reducedOccs = statement.occurrences.reduce(
    //   (prevOccs, occ, occIndex) => {
    //     let currentId = occ.qualifiers?.typeoflayout?.occurrences[0].id;
    //     if (currentId === Item["enumeration,uncounted"]) {
    //     }
    //     return occ.value;
    //   },
    //   initialOcc
    // );

    const lists = {};
    let firstIndex = 0;
    statement.occurrences.map((occ, index) => {
      if (occ.qualifiers) {
        const currentId = occ.qualifiers?.typeoflayout?.occurrences[0].id;
        const nextId =
          statement.occurrences[index + 1]?.qualifiers?.typeoflayout
            ?.occurrences[0]?.id;
        let sublist = {};
        const moreQualifiers = Object.keys(occ.qualifiers).length > 1;
        if (moreQualifiers) {
          const { typeoflayout, ...rest } = occ.qualifiers;
          sublist = rest;
        }

        if (currentId === Item["enumeration,uncounted"]) {
          if (firstIndex === 0) {
            firstIndex = index;
            lists[firstIndex] = [];
          }
          lists[firstIndex].push({ value: occ.value, sublist: sublist });
          if (nextId !== Item["enumeration,uncounted"]) {
            firstIndex = 0;
          }
        } else if (currentId === Item["enumeration,counted"]) {
          if (firstIndex === 0) {
            firstIndex = index;
            lists[firstIndex] = [];
          }
          lists[firstIndex].push({ value: occ.value, sublist: sublist });
          if (nextId !== Item["enumeration,counted"]) {
            firstIndex = 0;
          }
        }
      }
    });
    return lists;
  }
  const groupedLists = reduceStatementOccurrences(statement);

  // const unorderdList = () =>
  //   (statement.occurrences as any).filter(
  //     (occ: any) =>
  //       occ.qualifiers?.typeoflayout &&
  //       occ.qualifiers.typeoflayout.occurrences[0].id ===
  //       Item["enumeration,uncounted"]
  //   );
  // uncounted_list.push(<li>{occ.value}</li>);
  // var id_check =
  //   statement.occurrences[index + 1]?.qualifiers?.typeoflayout
  //   ?.occurrences[0]?.id;
  // if (id_check !== "Q1344") {
  //   view.push(<ul>{uncounted_list.map((li) => li)}</ul>);
  //   uncounted_list = [];
  // }

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

      {/* {statement.id === Property.subfields && ( */}
      {/*   <SubFields key={statement.id} {...statement} /> */}
      {/* )} */}

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
          groupedLists={groupedLists}
        />
      ))}
    </>
  );
}
