// import { Statement } from "@/types/entity";
// import { Property } from "@/types/property";
import { Item } from '@/types/item';
import RdaNavigation from '@/components/layout/RdaNavigation';
import GndNavigation from '@/components/layout/gndNavigation';
import DatamodelNavigation from '@/components/layout/datamodelNavigation';
// import Link from "next/link";

interface Props {
  entry: any;
}

export default function TopNavigation({ entry }: Props) {
  const id = entry.statements.schema?.occurrences[0]?.id;
  return (
    <>
      {id === Item['rda-documentation'] && <RdaNavigation />}
      {id === Item.gnddatamodel && <GndNavigation />}
      {id !== Item['rda-documentation'] && id !== Item.gnddatamodel && (
        <DatamodelNavigation />
      )}
    </>
  );
}
