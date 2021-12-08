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
                        <tr>
                {rows.map((cell, index) => {
                                        return (
                                                <td key={index}>{cell}</td>
                                        )
                                })}
                        </tr>
                </tbody>
                </table>
                </>
        )
}

export default CodingTable;
