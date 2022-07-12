import Statement from "@/components/details/statement";
import Header from "@/components/layout/header";
import Entity from "@/types/entity";
import { Item } from "@/types/item";
import { Property } from "@/types/property";
import Table from "./table";

interface Props {
  entity: Entity;
  headerLevel: number;
  embedded: boolean;
}

export default function Detail({
  entity,
  headerLevel = 1,
  embedded = false,
}: Props) {
  const groups = groupStatements(entity);
  // const isEmbedded = headerLevel !== 1

  return (
    <>
      <Header
        label={entity.label}
        id={entity.id}
        level={headerLevel}
        editor={true}
        embedded={embedded}
      />
      {entity.statements.definition &&
        entity.statements.definition.occurrences.map((occ) => (
          <p key={occ.value}>{occ.value}</p>
        ))}
      {groups && (
        <>
          <Table entity={entity} statements={groups.table} />
          {groups.rest.map((statement, index) => (
            <Statement
              key={index}
              statement={statement}
              index={index}
              headerLevel={headerLevel + 1}
            />
          ))}
        </>
      )}
    </>
  );
}

const groupsDefinition = {
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
      Property.examples,
    ],
  },
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
      Property.examples,
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
      Property.examples,
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
      Property.examples,
      Property.applicablefordatafield,
      Property.applicablefortypeofentity,
    ],
  },
  [Item["stadocumentation:rules"]]: {
    tableProperties: [
      // todo, add later
    ],
    restProperties: [Property.description],
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
    ],
  },
};

const groupStatements = (entity: Entity) => {
  const relevantKey = entity.statements.elementof?.occurrences[0].id;
  if (groupsDefinition[relevantKey]) {
    return {
      table: Object.keys(entity.statements)
        .filter((key) =>
          groupsDefinition[relevantKey].tableProperties.find(
            (tProp: any) => entity.statements[key].id === tProp
          )
        )
        .map((key) => entity.statements[key]),
      rest: Object.keys(entity.statements)
        .filter((key) =>
          groupsDefinition[relevantKey].restProperties.find(
            (rProp: any) => entity.statements[key].id === rProp
          )
        )
        .map((key) => entity.statements[key]),
    };
  } else {
    return {
      table: Object.keys(entity.statements)
        .filter((key) =>
          groupsDefinition["default-template"].tableProperties.find(
            (tProp: any) => entity.statements[key].id === tProp
          )
        )
        .map((key) => entity.statements[key]),
      rest: Object.keys(entity.statements)
        .filter(
          (key) =>
            !groupsDefinition["default-template"].ignoreProperties.find(
              (rProp: any) => entity.statements[key].id === rProp
            )
        )
        .map((key) => entity.statements[key]),
    };
  }
};
