import {useRouter} from "next/router"
import Link from "next/link"
import Statement from "@/components/details/statement"
import Header from "@/components/layout/header"
import Entry from "@/types/entry"
import {Item} from "@/types/item"
import {Property} from "@/types/property"
// import { getElements, sortStatements, getEntity } from "@/lib/api";
import Table from "./table"
import HtmlReactParser from "html-react-parser"

interface Props {
  embedded?: boolean
  entry: Entry
  headerLevel?: number
  ressourceTypePage?: boolean
}

export default function Detail({
  embedded = false,
  entry,
  headerLevel = 1,
  ressourceTypePage = false,
}: Props) {
  const {query} = useRouter()
  const groups = groupStatements(entry)
  const logo =
    (entry.statements.logo && entry.statements.logo.occurrences[0].value) ||
    undefined

  return (
    <>
      {!embedded ? (
        <div className={"title"}>
          <span className={"header"}>
            {!query.view ? (
              <Header
                label={entry.label}
                id={entry.id}
                level={headerLevel}
                logo={logo}
                editor={true}
                embedded={embedded}
              />
            ) : (
              <Header
                label={`Anwendungsprofil: ${entry.label}`}
                id={`Anwendungsprofil: ${entry.label}`}
                level={headerLevel}
                editor={true}
                embedded={embedded}
              />
            )}
          </span>
          {ressourceTypePage && (
            <span className={"button"}>
              <button className={"Button"}>
                {!query.view ? (
                  <Link
                    href={{
                      pathname: `${query.entryId}`,
                      query: {view: "application-profile"},
                    }}
                  >
                    <a>Anwendungsprofil</a>
                  </Link>
                ) : (
                  <Link
                    href={{
                      pathname: `${query.entryId}`,
                    }}
                  >
                    <a>Ressourcentypbeschreibung</a>
                  </Link>
                )}
              </button>
            </span>
          )}
        </div>
      ) : (
        <Header
          label={entry.label}
          id={entry.id}
          level={headerLevel}
          editor={true}
          embedded={embedded}
        />
      )}
      <br></br>
      {entry.statements.definition &&
        entry.statements.definition.occurrences.map((occ, index) =>
          HtmlReactParser(`<p key=${index}>${occ.value}</p>`)
        )}
      {groups && (
        <>
          <Table entity={entry} statements={groups.table} />
          {groups.rest.map((statement, index) => (
            <Statement
              key={index}
              statement={statement}
              elementOf={""}
              index={index}
              headerLevel={headerLevel + 1}
            />
          ))}
        </>
      )}
    </>
  )
}

const groupsDefinition = {
  [Item.gnddatafield]: {
    tableProperties: [
      // todo, add later
      Property.repetition,
    ],
    restProperties: [
      Property.description,
      Property.subfields,
      Property.validation,
      Property.implementationprovisions,
      Property.applicablefordatafield,
      Property.permitedvalues,
      Property["example(s)"],
      Property.authorizations,
    ],
  },
  [Item.gndsubfield]: {
    tableProperties: [
      // todo, add later
    ],
    restProperties: [
      Property.encoding,
      Property.description,
      Property.validation,
      Property.implementationprovisions,
      Property.applicablefordatafield,
      Property.permitedvalues,
      Property["example(s)"],
    ],
  },
  [Item["gndentitytype:entityencoding"]]: {
    tableProperties: [
      // todo, add later
    ],
    restProperties: [
      Property.encoding,
      Property.description,
      Property.datafields,
      Property.subfields,
      Property.validation,
      Property.implementationprovisions,
      Property.applicablefordatafield,
      Property.permitedvalues,
      Property["example(s)"],
      Property.applicablefordatafield,
      Property.applicablefortypeofentity,
    ],
  },
  [Item["stadocumentation:rules"]]: {
    tableProperties: [
      // todo, add later
    ],
    restProperties: [
      // Property["embedded(property)"],
      // Property["embeddedin(item)"],
      // Property["embeddedin(property)"],
      Property.description,
    ],
  },
  [Item.rdaproperty]: {
    tableProperties: [
      Property["entitytype/domain"],
      Property.parentproperty,
      Property.standardelementfor,
      Property.subproperties,
    ],
    restProperties: [
      Property.description,
      Property.recordingmethod,
      Property.sourcesofinformation,
      Property.basicrules,
      Property.specialrules,
      Property.specificrules,
      Property.permitedvalues,
      Property["example(s)"],
    ],
  },
  [Item["rda-ressourcetype"]]: {
    tableProperties: [
      // todo, add later
    ],
    restProperties: [
      Property.description,
      Property.elements,
      Property.sourcesofinformation,
      Property["description(attheend)"],
    ],
  },
  ["default-template"]: {
    // default renders tableProps, but NOT restProps like above
    tableProperties: [
      // todo, add later
    ],
    // here no render
    ignoreProperties: [
      Property.schema,
      Property.elementof,
      Property.definition,
      Property.logo,
    ],
  },
}

const groupStatements = (entry: Entry) => {
  const relevantKey = entry.statements.elementof?.occurrences[0].id
  if (groupsDefinition[relevantKey]) {
    return {
      table: Object.keys(entry.statements)
        .filter((key) =>
          groupsDefinition[relevantKey].tableProperties.find(
            (tProp: any) => entry.statements[key].id === tProp
          )
        )
        .map((key) => entry.statements[key]),
      rest: Object.keys(entry.statements)
        .filter((key) =>
          groupsDefinition[relevantKey].restProperties.find(
            (rProp: any) => entry.statements[key].id === rProp
          )
        )
        .map((key) => entry.statements[key]),
    }
  } else {
    return {
      table: Object.keys(entry.statements)
        .filter((key) =>
          groupsDefinition["default-template"].tableProperties.find(
            (tProp: any) => entry.statements[key].id === tProp
          )
        )
        .map((key) => entry.statements[key]),
      rest: Object.keys(entry.statements)
        .filter(
          (key) =>
            !groupsDefinition["default-template"].ignoreProperties.find(
              (rProp: any) => entry.statements[key].id === rProp
            )
        )
        .map((key) => entry.statements[key]),
    }
  }
}
