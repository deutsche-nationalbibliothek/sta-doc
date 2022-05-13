import { Statement } from "@/types/entity";
import { Item } from "@/types/item";
import styles from "../general/GeneralDetail.module.css";

interface Occurance {
  id: string;
  label: string;
  link: string;
  qualifiers?: string;
  value?: string;
  references?: any;
}

export default {
  [Item.italic]: (occurance: Occurance) => (
    <p className={styles.italic}>{occurance.value}</p>
  ),
  [Item.bold]: (occurance: Occurance) => (
    <p className={styles.bold}>
      <b>{occurance.value}</b>
    </p>
  ),
  [Item.firstordersubheading]: (occurance: Occurance, headerLevel: number) => (
    <header className={"header" + (headerLevel + 0)} id={occurance.value}>
      {occurance.value}
    </header>
  ),
  [Item.secondordersubheading]: (occurance: Occurance, headerLevel: number) => (
    <header className={"header" + (headerLevel + 1)} id={occurance.value}>
      {occurance.value}
    </header>
  ),
  [Item.thirdordersubheading]: (occurance: Occurance, headerLevel: number) => (
    <header className={"header" + (headerLevel + 2)} id={occurance.value}>
      {occurance.value}
    </header>
  ),
  [Item["enumeration,uncounted"]]: (
    occurance: Occurance,
    _headerLevel: number,
    index: number,
    statement: Statement
  ) => (
    <ItemList
      occurance={occurance}
      statement={statement}
      index={index}
      itemId={Item["enumeration,uncounted"]}
    />
  ),
  [Item["enumeration,counted"]]: (
    occurance: Occurance,
    _headerLevel: number,
    index: number,
    statement: Statement
  ) => (
    <ItemList
      occurance={occurance}
      statement={statement}
      index={index}
      itemId={Item["enumeration,counted"]}
    />
  ),
};

function ItemList({ statement, index, itemId, occurance }) {
  const filteredStatements = statement.occurrences.filter(
    (occ: any) =>
      occ.qualifiers?.typeoflayout &&
      occ.qualifiers.typeoflayout.occurrences[0].id === itemId
  );

  // todo: not ideal, structure data in StatementComp
  const cond =
    filteredStatements.findIndex((s) => s.value === occurance.value) + 1 ===
    filteredStatements.length;

  return (
    <>
      {cond && (
        <ListContainer ordered={Item["enumeration,counted"] === itemId}>
          {filteredStatements.map((occ: any) => (
            <li key={occ.id}>{occ.value}</li>
          ))}
        </ListContainer>
      )}
    </>
  );
}

function ListContainer({ children, ordered = false }) {
  return ordered ? <ol>{children}</ol> : <ul>{children}</ul>;
}
