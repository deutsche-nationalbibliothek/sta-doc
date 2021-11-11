import { useMemo } from 'react';
import { useTable } from 'react-table';
import { COLUMNS } from './FieldColumns';
import { DATA } from './FieldData';
import classes from './FieldTable.module.css';

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
        console.log('data',typeof data)
        console.log('obj',data[0])
        const columnsCoding = Object.keys(props.data[0]['codings'])
        // const columnHeader = Object.keys(props.data[0])
        const columnHeader = columnsCoding
        columnHeader.push('Datenfeld')


        const columns = useMemo(() => COLUMNS, [])
        const data2 = useMemo(() => data, [])
        
        const tableInstance = useTable({
                columns: COLUMNS,
                data: data2
        })

        const {
                getTableProps,
                getTableBodyProps,
                headerGroups,
                rows,
                prepareRow
        } = tableInstance
        // console.log('row',rows)
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
                <p>FieldTable</p>
                <table {...getTableProps()} className={classes.table}>
                <thead>
                {headerGroups.map((headerGroup, index) => (
                        <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column, index) => (
                                <th key={index} {...column.getHeaderProps()}>{column.render('Header')}</th>
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

export default FieldTable;

