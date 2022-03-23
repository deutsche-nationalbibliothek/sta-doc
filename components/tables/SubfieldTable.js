import { useMemo } from 'react';
import { useTable, useSortBy, useExpanded } from 'react-table';
import { COLUMNS } from './SubfieldColumns';
import classes from './SubfieldTable.module.css';

export default function SubfieldTable(props) {
  // console.log('FieldTable',props.data);
  const data = props.data
  // console.log('data in subfield',data)
  // const columnsCoding = Object.keys(props.data[0]['codings'])
  // const columnHeader = Object.keys(props.data[0])
  // const columnHeader = columnsCoding
  // columnHeader.push('Datenfeld')


  const columns = useMemo(() => COLUMNS, [])
  const data2 = useMemo(() => data, [])

  const tableInstance = useTable({
    columns: COLUMNS,
    data: data2        
  },
    useSortBy,
    useExpanded // Use the useExpanded plugin hook
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { expanded }
  } = tableInstance

  return (
    <>
    <table {...getTableProps()} className={classes.table}>
    <thead>
    {headerGroups.map((headerGroup, index) => (
      <tr key={index} {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((column, index) => (
        <th key={index} {...column.getHeaderProps(column.getSortByToggleProps())}>
        {column.render('Header')}
        <span>
        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
        </span>
        </th>
      ))}
      </tr>
    ))}
    </thead>
    <tbody {...getTableBodyProps()}>
    {rows.map((row, index) => {
      prepareRow(row)
      return (
        <tr key={index} {...row.getRowProps()}>
        {row.cells.map((cell, index) => {
          // console.log('cell',cell)
          return <td key={index} {...cell.getCellProps()}>{cell.render('Cell')}</td>
        })}
        </tr>
      )
    })}

    </tbody>
    </table>
    </>
  )
}
