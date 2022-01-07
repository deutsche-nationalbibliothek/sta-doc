import { Fragment } from 'react';
import { useMemo } from 'react';
import { useTable, useSortBy, useExpanded } from 'react-table';
import { COLUMNS } from './FieldCodingColumns';
import classes from './CodingTable.module.css';

function GetRow(props) {
  return(
    <tr className={classes.tr}>
    {Object.keys(props).map((key,index) => <td key={index}>{props[key]}</td> )}
    </tr>
  )
}

function CodingTable(props) {
  const columns = useMemo(() => COLUMNS, [])
  const data = useMemo(() => props.data, [])
  
  const tableInstance = useTable({
    columns: COLUMNS,
    data: data
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
    <table {...getTableProps()} className={classes.table}>
    <thead>
    {headerGroups.map((headerGroup,index) => (
      <tr key={index} {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((column,index) => (
        <th key={index} {...column.getHeaderProps()}>{column.render("Header")}</th>
      ))}
      </tr>
    ))}
    </thead>
    <tbody {...getTableBodyProps()}>
    {rows.map((row, index) => {
      prepareRow(row);
      return (
        <tr key={index} {...row.getRowProps()}>
        {row.cells.map(cell => {
          return <td key={index} {...cell.getCellProps()}>{cell.render("Cell")}</td>;
        })}
        </tr>
      );
    })}
    </tbody>
    </table>
  )
  // console.log('FieldTable',props.data);
  // const rows = props.rows
  // const columns = props.columns
  // return (
    // <>
    // <table className={classes.table}>
    // <thead>
    // <tr>{columns.map((column, index) => <th key={index}>{column}</th>)}</tr>
    // </thead>
    // <tbody>
    // {rows.map((row, index) => <GetRow key={index} {...row}/>)}
    // </tbody>
    // </table>
    // </>
  // )
  // return null
}

export default CodingTable;
