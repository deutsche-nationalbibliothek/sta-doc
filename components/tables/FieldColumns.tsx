import Link from 'next/link';
const WIKIBASE_URL = 'http://doku.wikibase.wiki/entity/';

export const COLUMNS = [
  {
    Header: 'PICA3',
    accessor: 'codings.PICA3',
    sortType: 'basic',
  },
  {
    Header: 'PICA+',
    accessor: 'codings.PICA+',
    sortType: 'basic',
  },
  {
    Header: 'MARC21',
    accessor: 'codings.MARC 21',
    sortType: 'basic',
  },
  {
    Header: 'Feldbezeichnung',
    accessor: 'label',
    // Cell: ({row}) => (<a href={`fields/${row.original.id}`}>{row.original.label}</a>),
    // Cell: ({row}) => (<a href={row.original.editLink}>{row.original.label}</a>),
    Cell: ({ row }) => (
      <Link href={`/entries/${encodeURIComponent(row.original.id)}`}>
        <a>{row.original.label}</a>
      </Link>
    ),
    sortType: 'basic',
  },
];
