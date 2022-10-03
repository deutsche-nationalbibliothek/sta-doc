import Link from 'next/link';
const WIKIBASE_URL = 'http://doku.wikibase.wiki/entity/';

export const COLUMNS = [
  {
    Header: 'RDA Eigenschaft',
    accessor: 'label',
    sortType: 'basic',
    Cell: ({ row }) => (
      <Link href={`/entries/${encodeURIComponent(row.values.id)}`}>
        <a>{row.values.label}</a>
      </Link>
    ),
  },
  {
    Header: 'Entitätstyp',
    accessor: 'domainLabel',
    sorttype: 'basic',
  },
  {
    Header: 'Bearbeitungslink',
    accessor: 'id',
    sortType: 'basic',
    // Cell: ({row}) => (<Link to={{ pathname: `/rda/properties/${row.values.id}`}}>{row.values.id}</Link>)
    Cell: ({ row }) => (
      <a target="_blank" rel="noreferrer" href={WIKIBASE_URL + row.values.id}>
        &#x270E; ({row.values.id})
      </a>
    ),
    // Cell: ({row}) => (<a href={`/rda/properties/${row.original.id}`}>{row.original.id}</a>),
  },
];
