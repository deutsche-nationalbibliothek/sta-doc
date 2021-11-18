export const COLUMNS = [
    {
            Header: 'PICA+',
            accessor: 'codings.PICA+',
            sortType: 'basic'
    },
    {
            Header: 'PICA3',
            accessor: 'codings.PICA3',
            sortType: 'basic'
    },
    {
            Header: 'MARC21',
            accessor: 'codings.MARC 21',
            sortType: 'basic'
    },
    {
            Header: 'Feldbezeichnung',
            accessor: 'label',
            Cell: ({row}) => (<a href={row.original.editLink}>{row.original.label}</a>),
            sortType: 'basic'
    }
]
