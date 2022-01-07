import { useMemo } from 'react';
import { useTable, useSortBy, useExpanded } from 'react-table';
import { COLUMNS } from './FieldColumns';
import classes from './FieldTable.module.css';
import SubfieldTable from '../tables/SubfieldTable.js';
import Collapsible from 'react-collapsible';
import classesCollapsible from './Collapsible.module.css';

// <table className={classes.table}>
// <thead>
// <tr>{rows[0] && Object.keys(rows).map((heading) => <th>{heading}</th>)}</tr>
// </thead>
// <tbody>
// </tbody>
// </table>

function FieldTable(props) {
  // console.log('FieldTable',props.data);
  const data = props.data
  // console.log('data raw',data)
  // console.log('obj',data[0])
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
  // console.log('rows',rows)
  // console.log('data',data)
  // return (typeof column === 'string') ? 
  // <td>{row[column]}</td> :
  // <td>no</td>
  // <table className={classes.table}>
  // <thead>
  // <tr>{props.data[0] && columnHeader.map((element, index) => <th key={index}>{element}</th>)}</tr>
  // </thead>
  // <tbody>
  // {data.map((row, index) => <tr key={index}>
  // {
  // columnHeader.map((column, index) => 
  // {
  // const obj = row['codings']
  // const arr = Object.values(obj)
  // // console.log(column)
  // return (column === 'Datenfeld') ? 
  // <td key={index}>{row['label']}</td> :
  // <td>{arr[index]}</td>

  // }
  // )
  // }
  // </tr>)
  // }
  // </tbody>
  // </table>
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
      // console.log('subfields',row.original.subfields)
      const mapper = row.original.subfields
      // TODO workaround here: push id of prop to the object
      Object.keys(mapper).map(key => {
        mapper[key]['id'] = key
      })
      const subfields = []
      Object.keys(mapper).map(key => {
        subfields.push(mapper[key])
      })
      // console.log('subfields arr',subfields)
      // const subfields = row['subfields']
      prepareRow(row)
      return (
        <tr key={index} {...row.getRowProps()}>
        {row.cells.map((cell, index) => {
          // console.log('cell',cell)
          // console.log('subfields',subfields)
          if (cell.column['Header'] === 'Feldbezeichnung') {
            return( <td key={index} {...cell.getCellProps()}>{cell.render('Cell')}
              <Collapsible
              trigger='Zeige Unterfelder' 
              triggerWhenOpen='Schließe Unterfelder'
              ClassName={classesCollapsible.Collapsible}
              triggerClassName={classesCollapsible.CustomTriggerCSS}
              triggerOpenedClassName={classesCollapsible.CustomTriggerCSSopen}
              >
              <SubfieldTable data={subfields}/>
              </Collapsible>
              </td>
            )}
          else{
            return <td key={index} {...cell.getCellProps()}>{cell.render('Cell')}</td>
          }
        })}
        </tr>
      )
    })}
    </tbody>
    </table>
    </>
  )
}

export default FieldTable;

