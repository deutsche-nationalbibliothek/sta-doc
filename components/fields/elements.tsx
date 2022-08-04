import React, { Fragment } from "react";
import Collapsible from "react-collapsible";
import { Item } from "@/types/item";
import { Property } from "@/types/property";
import Header from "../layout/header";
import Detail from "../details/index";

interface Props {
  elements: any;
  headerLevel: number;
}

export default function Elements({ elements, headerLevel }: Props) {
  const elementsByWemi = elements.occurrences.reduce((acc, value) => {
    // Group initialization
    if (!acc[value.qualifiers?.wemilevel?.occurrences[0].label]) {
      acc[value.qualifiers?.wemilevel?.occurrences[0].label] = [];
    }
    // Grouping
    acc[value.qualifiers?.wemilevel?.occurrences[0].label].push(value);

    return acc;
  }, {});
  // console.log("elementsByWemi", elementsByWemi);
  // console.log("objentries", Object.entries(elementsByWemi));

  return (
    <>
      {Object.entries(elementsByWemi).map(
        ([label, wemi]: any, index: number) => (
          <Fragment key={index}>
            <Header
              label={label}
              id={label}
              level={headerLevel}
              link={wemi[0].qualifiers.wemilevel.occurrences[0].link}
            />
            {wemi.map(
              (statement: any) =>
                (statement.qualifiers["embedded(item)"] ||
                  statement.qualifiers.description) && (
                  <>
                    <Header
                      label={statement.label}
                      id={statement.label}
                      level={headerLevel + 1}
                      link={statement.link}
                    />
                    {statement.qualifiers.description &&
                      statement.qualifiers.description.occurrences.map(
                        (occ: any) => <p>{occ.value}</p>
                      )}
                    {statement.qualifiers["embedded(item)"] &&
                      statement.qualifiers["embedded(item)"].occurrences.map(
                        (quali: any) => (
                          <Collapsible
                            key={index}
                            openedClassName={
                              quali.statements.elementof.occurrences[0].id ===
                                Item.gnddatafield
                                ? "CollapsibleOpenGnd"
                                : "CollapsibleOpenRda"
                            }
                            open={true}
                            overflowWhenOpen={"unset"}
                            trigger={
                              <span>Weiterführende Informationen &#8744; </span>
                            }
                            triggerWhenOpen={<span>&#8743; </span>}
                            triggerClassName={
                              quali.statements.elementof.occurrences[0].id ===
                                Item.gnddatafield
                                ? "CollapsibleClosedGnd"
                                : "CollapsibleClosedRda"
                            }
                            triggerOpenedClassName={"CollapsibleTriggerOpen"}
                            triggerElementProps={{
                              id: `Collapsible-${quali.label}`,
                            }}
                          >
                            {
                              <Detail
                                entity={quali}
                                headerLevel={headerLevel + 2}
                                embedded={true}
                                ressourceTypePage={false}
                              />
                            }
                          </Collapsible>
                        )
                      )}
                  </>
                )
            )}
          </Fragment>
        )
      )}
    </>
  );
}
