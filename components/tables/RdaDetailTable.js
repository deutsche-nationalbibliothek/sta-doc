import { Link } from 'next/link'
import { Fragment, useMemo } from 'react'
import { useTable, useSortBy, useExpanded } from 'react-table'
import { COLUMNS } from './RdaDetailTableColumns'
import styles from './RdaDetailTable.module.css'

export default function RdaDetailTable(props) {
  let buildTable = (obj) => {
    console.log('obj',obj)

    var arr=[]
    for(var k in obj) {
      switch (obj[k].id) {
        case 'P124': arr.push({ 'label':obj[k].label, 'value':obj[k].occurrences[0].label, 'id':obj[k].occurrences[0].id })
          break
        case 'P401': arr.push({ 'label':obj[k].label, 'value':obj[k].occurrences[0].label, 'id':obj[k].occurrences[0].id })
          break
        case 'P119': arr.push({ 'label':'Link zum Toolkit', 'value':obj[k].occurrences[0].label, 'id':obj[k].occurrences[0].id })
          break
        case 'P385': arr.push({ 'label':'Status', 'value':obj[k].occurrences[0].label, 'id':obj[k].occurrences[0].id })
          break
        case 'P126': arr.push({ 'label':obj[k].label, 'value':obj[k].occurrences[0].label, 'id':obj[k].occurrences[0].id })
          break
      }
      // arr.push(obj[k])
    }
    return arr
  }
  let table = buildTable(props.data)
  console.log('table',table)

  const columns = useMemo(() => COLUMNS, [])
  const data = useMemo(() => table, [])

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
    <table {...getTableProps()} className={styles.table}>
      <thead>
        {headerGroups.map((headerGroup,index) => (
          <tr key={index} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column,index) => (
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
        {rows.map((row, index) => <TableRow key={index} {...row}/>)}
      </tbody>
    </table>
  )
}

function TableCell(props) {
  return <td key={props.id} {...props.getCellProps()}>{props.render("Cell")}</td>
}
// <Link href={`/rda/properties/${props.value}`}>
// <a>{props.render("Cell")}</a>
// </Link>

function TableRow(props) {
  return (
    <Fragment key={props.index}>
      <tr {...props.getRowProps()}>
        {props.cells.map((cell,index) => {
          cell.id = index
          return <TableCell key={index} {...cell}/>
        })}
      </tr>
    </Fragment>
  )
}
