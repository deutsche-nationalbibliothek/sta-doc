import { Statement } from "@/types/entity";
import { Property } from "@/types/property";
import Link from "next/link";
import React, { Fragment } from "react";
import Collapsible from "react-collapsible";
import Detail from ".";
import Examples from "../fields/Examples";
import References from "../fields/References";
import styles from "../general/GeneralDetail.module.css";
import layoutItem from "./layout-item";

interface Props {
  occurance: {
    id: string;
    label: string;
    link: string;
    qualifiers?: string;
    value?: string;
    references?: any;
  };
  headerLevel: number;
  index: number;
  statement: Statement;
}

export default function Occurance({
  occurance,
  headerLevel,
  index,
  statement,
}: Props) {
  return (
    <>
      {occurance.id && (
        <p className={styles.bold}>
          &ensp;&ensp;&rArr;&ensp;
          <Link href={occurance.link}>
            <a>{occurance.label}</a>
          </Link>
        </p>
      )}

      {(!occurance.qualifiers ||
        !Object.keys(occurance.qualifiers).find(
          (el) => el === "typeoflayout"
        )) && <p>{occurance.value}</p>}

      {occurance.qualifiers && (
        <>
          {Object.entries(occurance.qualifiers).map(
            ([, qualifier]: any, index2: number) => (
              <Fragment key={index2}>
                {(qualifier.id === Property["see(item)"] ||
                  qualifier.id === Property["see(property)"]) &&
                  (qualifier.occurrences.length > 0 ? (
                    qualifier.occurrences.map((quali: any) => (
                      <p key={quali.label} className={styles.bold}>
                        &ensp;&ensp;&rArr;&ensp;
                        <Link href={quali.link || ""}>
                          <a>{quali.label}</a>
                        </Link>
                      </p>
                    ))
                  ) : (
                    <p className={styles.bold}>
                      &ensp;&ensp;&rArr;&ensp;FEHLENDER LINK
                    </p>
                  ))}

                {qualifier.id === Property.typeoflayout &&
                  layoutItem[qualifier.occurrences[0].id](
                    occurance,
                    headerLevel,
                    index,
                    statement
                  )}
                {(qualifier.id === Property["embedded(item)"] ||
                  qualifier.id === Property["embedded(property)"]) &&
                  qualifier.occurrences.map((quali: any) => (
                    <Collapsible
                      key={index}
                      trigger={<span> {quali.label} &#8744; </span>}
                      triggerWhenOpen={<span>&#8743; </span>}
                      openedClassName={styles.Collapsible}
                      triggerClassName={styles.CustomTriggerCSS}
                      triggerOpenedClassName={styles.CustomTriggerCSSopen}
                    >
                      {
                        <div>
                          <Detail
                            entity={quali}
                            headerLevel={headerLevel + 1}
                          />
                        </div>
                      }
                    </Collapsible>
                  ))}
                {qualifier.id === Property.examples && (
                  <Examples examples={qualifier} />
                )}
                {qualifier.id !== Property.typeoflayout &&
                  qualifier.id !==
                  Property["typeoflayout(embeddedelement)"] && (
                    <>
                      <p className={styles.bold}>{qualifier.label}: </p>
                      {qualifier.occurrences.map((quali: any) =>
                        quali.id ? (
                          <p key={quali.label} className={styles.bold}>
                            &ensp;&ensp;&rArr;&ensp;
                            <Link href={quali.link || ""}>
                              <a>{quali.label}</a>
                            </Link>
                          </p>
                        ) : (
                          <p key={quali.label}>{quali.value}</p>
                        )
                      )}
                    </>
                  )}
              </Fragment>
            )
          )}
        </>
      )}
      {occurance.references && <References references={occurance.references} />}
    </>
  );
}
