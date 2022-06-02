// import { Statement } from "@/types/entity";
// import { Property } from "@/types/property";
import { Item } from "@/types/item";
import RdaNavigation from "@/components/layout/RdaNavigation";
import GndNavigation from "@/components/layout/gndNavigation";
// import Link from "next/link";

interface Props {
  field: any;
}

export default function TopNavigation({ field }: Props) {
  return (
    <>
      {field.statements.elementof.occurrences[0].id === Item.rdaproperty && (
        <RdaNavigation />
      )}
      {(field.statements.elementof.occurrences[0].id === Item.gnddatafield ||
        field.statements.elementof.occurrences[0].id === Item.gndsubfield) && (
        <GndNavigation />
      )}
    </>
  );
}
