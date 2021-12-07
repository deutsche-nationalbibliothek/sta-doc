import { Fragment } from 'react';
import classes from './CodingTable.module.css';

function CodingTable(props) {
        // console.log('FieldTable',props.data);
        const rows = props.rows
        const columns = props.columns
        return (
                <>
                <table className={classes.table}>
                <thead>
                <tr>{columns.map((column, index) => <th key={index}>{column}</th>)}</tr>
                </thead>
                <tbody>
                {rows.map((row, index) => {
                        return(
                                <tr key={index}>
                                {columns.map((column, index) => {
                                        // console.log(column)
                                        return (
                                                <td key={index}>{row[index]}</td>
                                        )
                                })}
                                </tr>
                        )
                })}
                </tbody>
                </table>
                </>
        )
}

export default CodingTable;
