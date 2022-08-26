import { Statement } from "@/types/entry";
import { Item } from "@/types/item";
import Header from "../layout/header";
import HtmlReactParser from "html-react-parser";
import CollapsibleWithPreview from "./collapsibleWithPreview";
import Collapsible from "react-collapsible";

interface Occurance {
  id: string;
  label: string;
  link: string;
  statement: Statement;
  qualifiers?: string;
  value?: string;
  references?: any;
}

export default {
  [Item["collapsible-collapsed"]]: (occurance: Occurance) => (
    <CollapsibleWithPreview occurance={occurance} />
  ),
  // [Item["collapsible-collapsed"]]: (occurance: Occurance) => (
  //   <>
  //     <Collapsible
  //       key={occurance.id}
  //       openedClassName={"CollapsibleOpenRda"}
  //       open={true}
  //       overflowWhenOpen={"unset"}
  //       trigger={<span>Weiterführende Informationen &#8744; </span>}
  //       triggerWhenOpen={<span>&#8743; </span>}
  //       triggerClassName={"CollapsibleClosedRda"}
  //       triggerOpenedClassName={"CollapsibleTriggerOpen"}
  //       triggerElementProps={{
  //         id: `Collapsible-${occurance.label}`,
  //       }}
  //     >
  //       {HtmlReactParser(`<div>${occurance.value}</div>`)}
  //     </Collapsible>
  //   </>
  // ),
  [Item["example(typeoflayout)"]]: (occurance: Occurance) => (
    <>
      <div className="example-typeoflayout">
        {HtmlReactParser(`<p>${occurance.value}</p>`)}
      </div>
    </>
  ),
  [Item.italic]: (occurance: Occurance) => (
    <p className={"italic"}>{occurance.value}</p>
  ),
  [Item.bold]: (occurance: Occurance) => (
    <p className={"bold"}>
      <b>{occurance.value}</b>
    </p>
  ),
  [Item.firstordersubheading]: (occurance: Occurance, headerLevel: number) => (
    <Header
      label={occurance.value}
      id={occurance.value}
      level={(headerLevel = headerLevel + 0)}
    />
  ),
  [Item.secondordersubheading]: (occurance: Occurance, headerLevel: number) => (
    <Header
      label={occurance.value}
      id={occurance.value}
      level={(headerLevel = headerLevel + 1)}
    />
  ),
  [Item.thirdordersubheading]: (occurance: Occurance, headerLevel: number) => (
    <Header
      label={occurance.value}
      id={occurance.value}
      level={(headerLevel = headerLevel + 2)}
    />
  ),
  [Item["enumeration,uncounted"]]: (
    occurance: Occurance,
    _headerLevel: number,
    index: number,
    statement: Statement,
    groupedLists: object
  ) => (
    <ItemList
      occurance={occurance}
      statement={statement}
      index={index}
      itemId={Item["enumeration,uncounted"]}
      groupedLists={groupedLists}
    />
  ),
  [Item["enumeration,counted"]]: (
    occurance: Occurance,
    _headerLevel: number,
    index: number,
    statement: Statement,
    groupedLists: object
  ) => (
    <ItemList
      occurance={occurance}
      statement={statement}
      index={index}
      itemId={Item["enumeration,counted"]}
      groupedLists={groupedLists}
    />
  ),
};

function ItemList({ statement, index, itemId, occurance, groupedLists }) {
  // const filteredStatements = statement.occurrences.filter(
  //   (occ: any) =>
  //     occ.qualifiers?.typeoflayout &&
  //     occ.qualifiers.typeoflayout.occurrences[0].id === itemId
  // );
  // const cond =
  //   filteredStatements.findIndex((s) => s.value === occurance.value) + 1 ===
  //   filteredStatements.length;

  // todo: not ideal, structure data in StatementComp
  const cond = index in groupedLists;
  return (
    <>
      {cond && (
        <ListContainer ordered={Item["enumeration,counted"] === itemId}>
          {groupedLists[index].map((listObject: any) => (
            <li key={listObject.value}>{HtmlReactParser(`<p>${listObject.value}</p>`)}</li>
          ))}
        </ListContainer>
      )}
    </>
  );
}

function ListContainer({ children, ordered = false }) {
  return ordered ? <ol>{children}</ol> : <ul>{children}</ul>;
}
