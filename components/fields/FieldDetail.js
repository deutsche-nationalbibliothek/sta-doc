import { Fragment } from 'react';
import CodingTable from '../tables/CodingTable.js';
import References from './References.js';
import classes from './FieldDetail.module.css';

function FieldDetail(props) {
  const field = props.data
  const rows = []
  const row0 = {
    label: field.label,
    format: {},
    repeat: field.statements.repeat.occurrences[0].value
  }
  field.statements.coding.occurrences.map((coding,index) => {
    let key = coding.qualifiers.type.occurrences[0].label
    row0['format'][key] = coding.value
  })
  rows.push(row0)
  field.statements.subfields.occurrences.map((subfield,index) => {
    let row = {
      label: subfield.label,
      format: {},
      repeat: subfield.qualifiers.repeat.occurrences[0].value
    }
    subfield.coding.occurrences.map((coding,index) => {
      let key = coding.qualifiers.type.occurrences[0].label
      row['format'][key] = coding.value
    })
    rows.push(row)
  })
  console.log('rows',rows)
  return (
    <>
    <title>{field.label}</title>
    <section className={classes.detail}>
    <h1>{field.label}</h1>
    <h3>{field.statements.definition.label}</h3>
    {field.statements.definition.occurrences.map((occurrence,index) => {
      return(
        <p key={index}>{occurrence.value}</p>
      )
    })}
    <CodingTable data={rows} />
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
    <h3>{field.statements.subfields.label}</h3>
    {field.statements.subfields.occurrences.map((subfield,index) => {
      // console.log(subfield)
      let ListDescription
      const descriptions = subfield.qualifiers.description
      descriptions ? (ListDescription = descriptions.occurrences)
        : ListDescription = []
      let ListReference
      const references = subfield.references
      references ? (ListReference = references)
        : ListReference = []
      return(
        <Fragment key={index}>
        <h4>{subfield.label}</h4>
        {references &&
          <References references={subfield.references}/>
        }
        </Fragment>
      )
    })}
    </section>
    </>
  )
}

export default FieldDetail
