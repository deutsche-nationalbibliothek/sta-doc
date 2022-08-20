import { Property } from "@/types/property";
import CodingTable from "@/components/tables/CodingTable";
import RdaDetailTable from "@/components/tables/RdaDetailTable";
import { Item } from "@/types/item";
import Entity, { Statement } from "@/types/entry";

interface Props {
  entity: Entity;
  statements: Statement[];
}

export default function Table({ entity, statements }: Props) {
  if (entity.statements.elementof?.occurrences[0].id === Item.rdaproperty) {
    return <RdaDetailTable data={statements} />;
  } else if (
    entity.statements.elementof?.occurrences[0].id === Item.gnddatafield
  ) {
    // todo, check if prop is working
    return <CodingTable data={entity} />;
  } else {
    return null;
  }
}
