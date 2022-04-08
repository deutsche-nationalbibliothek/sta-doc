// import { Link } from 'next/link'
export const COLUMNS = [
  {
    Header: 'Elementeigenschaften',
    accessor: 'label',
    sortType: 'basic'
  },
  {
    Header: 'Wert',
    accessor: 'value',
    sorttype: 'basic',
    Cell: ({row}) => (<a href={`/general/${row.original.id}`}>{row.original.value}</a>),
  },
  // {
    // Header: 'Link',
    // accessor: 'id',
    // sortType: 'basic',
    // // Cell: ({row}) => (<Link to={{ pathname: `/rda/properties/${row.values.id}`}}>{row.values.id}</Link>)
    // // Cell: ({row}) => (<Link href={`/rda/properties/${encodeURIComponent(row.values.id)}`}><a>{row.values.id}</a></Link>)
    // Cell: ({row}) => (<a href={`/rda/properties/${row.original.id}`}>{row.original.id}</a>),
  // }
]
