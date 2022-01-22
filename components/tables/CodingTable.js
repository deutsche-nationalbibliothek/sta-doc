import { Fragment } from 'react';
import { useMemo } from 'react';
import { useTable, useSortBy, useExpanded } from 'react-table';
import { COLUMNS } from './FieldCodingColumns';
import classes from './CodingTable.module.css';


function References({references}) {
  if (references) {
    return(
      <>
      <h5 className={classes.h5}>Referenzen</h5>
      {references.map((ref,index) => <ReferenceBox key={index} {...ref} />)}
      </>
    )
  }
}
function ReferenceBox(props) {
  const referenceMap = {
    url: (ref) => <a href={ref.value}>{ref.value}</a>,
    default: (ref) => <p>{ref.value}</p>
  }
  return(
    <div className={classes.div}>
    {
      Object.keys(props).map((key,index) => 
        <Fragment key={index}>
        {referenceMap[key] ? referenceMap[key](props[key]) : referenceMap.default(props[key])}
        </Fragment>
      )
    }
    </div>
  )
}

function TableCell(props) {
  // console.log('props',props)
  if (props.id === 0) {
    return (
      <>
      <td key={props.id} {...props.getCellProps()}><a href={`#${props.value}`}>{props.render("Cell")}</a></td>
      </>
    )
  } else {
    return <td key={props.id} {...props.getCellProps()}>{props.render("Cell")}</td>
  }
}

function TableRow(props) {
  // console.log('props',props)
  if(props.index === 0) {
    return (
      <Fragment key={props.index}>
      <tr className={classes.firstrow} {...props.getRowProps()}>
      {props.cells.map((cell,index) => {
        return (props.index === 0 ? 
          <td key={index} className={classes.firstrow} {...cell.getCellProps()}>{cell.render("Cell")}</td> : 
          <td key={index} {...cell.getCellProps()}>{cell.render("Cell")}</td>)
      })}
      </tr>
      <tr className={classes.secondrow}><td className={classes.secondrow} colSpan={props.allCells.length}>Unterfelder</td></tr>
      </Fragment>
    )
  } else {
    return (
      <Fragment key={props.index}>
      <tr {...props.getRowProps()}>
      {props.cells.map((cell,index) => {
        cell.id = index
        // console.log('cell',cell)
        return <TableCell key={index} {...cell}/>
      })}
      </tr>
      </Fragment>
    )
  }
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
  rows.forEach(prepareRow)

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
    {rows.map((row, index) => <TableRow key={index} {...row}/>)}
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
