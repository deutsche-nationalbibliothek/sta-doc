import Link from 'next/link'

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
    Cell: ({row}) => (<Link href={`/general/${encodeURIComponent(row.original.id)}`}><a>{row.original.value}</a></Link>)
  },
]
