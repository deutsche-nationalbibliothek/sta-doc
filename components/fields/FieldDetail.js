import { Fragment } from 'react';
import classes from './FieldDetail.module.css';

function FieldDetail(props) {
        // console.log(props)
        const field = props.data
        return (
                <>
                <section className={classes.detail}>
                <h1>{field.label}</h1>
                <h3>Definition</h3>
                <p>{field.definition}</p>
                <h3>Beschreibung</h3>
                <p>{field.description}</p>
                <p>{field.editLink}</p>
                <h3>Validation</h3>
                {field.rulesOfUse.map((rule,index) => {
                return(
                <p key={index}>{rule}</p>
                )})}
                </section>
                </>
        )
}

export default FieldDetail
