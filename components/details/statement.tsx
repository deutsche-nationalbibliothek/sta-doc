import { useRouter } from "next/router";
import { Statement } from "@/types/entity";
import { Item } from "@/types/item";
import { Property } from "@/types/property";
import Link from "next/link";
import React from "react";
import Examples from "../fields/Examples";
import Elements from "../fields/elements";
import Header from "../layout/header";
import Occurance from "./occurance";

interface Props {
  statement: Statement;
  headerLevel: number;
  elementOf: string;
  index: number;
}

export default function StatementComp({
  statement,
  headerLevel,
  elementOf,
  index,
}: Props) {
  const { query } = useRouter();
  const applicationProfile = query.path;
  console.log("appProf", applicationProfile);
  function handleStatementLists(statement) {
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
  const groupedLists = handleStatementLists(statement);
  const statementHeader =
    statement.id !== Property.description &&
    statement.id !== Property["embeddedin(item)"] &&
    statement.id !== Property["embeddedin(property)"] &&
    // statement.id !== Property.elements &&
    statement.id !== Property["description(attheend)"];
  const statementElements = statement.id === Property.elements;

  return (
    <>
      {statementHeader && (
        <Header label={statement.label} id={statement.id} level={headerLevel} />
      )}
      {statementElements && (
        <Elements elements={statement} headerLevel={headerLevel} />
      )}
      {statement.id === Property.examples && <Examples examples={statement} />}
      {(statement.id === Property["embeddedin(property)"] ||
        statement.id === Property["embeddedin(item)"]) &&
        statement.occurrences.map((occ: any) => (
          <p key={occ.id} className={"bold"}>
            eingebettet in: &rArr;&ensp;
            {/* todo, fix || '#' */}
            <Link href={occ.link || "#"}>
              <a>{occ.label}</a>
            </Link>
          </p>
        ))}

      {statement.id !== Property.elements &&
        statement.occurrences.map((occ: any, index: number) => (
          <Occurance
            key={`${index}-${occ.id}`}
            occurance={occ}
            headerLevel={headerLevel}
            index={index}
            statement={statement}
            groupedLists={groupedLists}
          />
        ))}
    </>
  );
}
