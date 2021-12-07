import { Fragment } from 'react';
import CodingTable from '../tables/CodingTable.js';
import classes from './FieldDetail.module.css';

function FieldDetail(props) {
        // console.log(props)
        const field = props.data
        const coding_columns = []
        field.statements.coding.occurrences.map((occurrence,index) => {
                // coding_columns[index] = occurrence.qualifiers.
                console.log('occurrence',occurrence.qualifiers.type)
        })
        // console.log(coding_columns)


        return (
                <>
                <title>{field.label}</title>
                <section className={classes.detail}>
                <h1>{field.label}</h1>
                <p>{field.description}</p>
                <h3>{field.statements.coding.label}</h3>
                <ul>
                {field.statements.coding.occurrences.map((occurrence,index) => {
                        return(
                                <li key={index}>{occurrence.value}</li>
                        )
                })}
                </ul>
                <h3>{field.statements.definition.label}</h3>
                {field.statements.definition.occurrences.map((occurrence,index) => {
                        return(
                                <p key={index}>{occurrence.value}</p>
                        )
                })}
                <h3>{field.statements.rulesofuse.label}</h3>
                {field.statements.rulesofuse.occurrences.map((occurrence,index) => {
                        return(
                                <p key={index}>{occurrence.value}</p>
                        )
                })}
                <h3>{field.statements.validation.label}</h3>
                {field.statements.validation.occurrences.map((occurrence,index) => {
                        return(
                                <p key={index}>{occurrence.value}</p>
                        )
                })}
                </section>
                </>
        )
}

export default FieldDetail
