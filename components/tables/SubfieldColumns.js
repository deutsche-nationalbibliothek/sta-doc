import Link from "next/link";

export const COLUMNS = [
  {
    Header: "Unterfelder",
    columns: [
      {
        Header: "PICA3",
        accessor: "codings.PICA3",
        sortType: "basic",
      },
      {
        Header: "PICA+",
        accessor: "codings.PICA+",
        sortType: "basic",
      },
      {
        Header: "MARC21",
        accessor: "codings.MARC 21",
        sortType: "basic",
      },
      {
        Header: "Beschreibung",
        accessor: "label",
        Cell: ({ row }) => (
          <Link href={"/gnd/subfields/" + row.original.id}>
            {row.original.label}
          </Link>
        ),
        sortType: "basic",
      },
    ],
  },
];
