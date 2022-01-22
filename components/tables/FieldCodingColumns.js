export const COLUMNS = [
  {
    // First group
    Header: 'Feld',
    accessor: 'label'
  },
  {
    // Second group
    Header: 'Format',
    columns: [
      {
        Header: 'PICA+',
        accessor: 'format.PICA+',
        sortType: 'basic'
      },
      {
        Header: 'PICA3',
        accessor: 'format.PICA3',
        sortType: 'basic'
      },
      {
        Header: 'MARC21',
        accessor: 'format.MARC 21 Format für Normdaten',
        sortType: 'basic'
      },
      {
        Header: 'GND Ontologie',
        accessor: 'format.GND-Ontologie',
        sortType: 'basic'
      }
        
    ]
  },
  {
    // Third group
    Header: 'Wiederholung',
    accessor: 'repeat'
  }
]
