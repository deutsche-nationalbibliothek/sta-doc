import Link from "next/link";

export const COLUMNS = [
  {
    Header: "RDA Eigenschaft",
    accessor: "label",
    sortType: "basic",
  },
  {
    Header: "Entitätstyp",
    accessor: "statements.entitytype/domain.occurrences[0].label",
    sorttype: "basic",
  },
  {
    Header: "Link",
    accessor: "id",
    sortType: "basic",
    // Cell: ({row}) => (<Link to={{ pathname: `/rda/properties/${row.values.id}`}}>{row.values.id}</Link>)
    Cell: ({ row }) => (
      <Link href={`/rda/properties/${encodeURIComponent(row.values.id)}`}>
        <a>{row.values.id}</a>
      </Link>
    ),
    // Cell: ({row}) => (<a href={`/rda/properties/${row.original.id}`}>{row.original.id}</a>),
  },
];
