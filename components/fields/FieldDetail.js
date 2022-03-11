import { Fragment } from 'react';
import CodingTable from '../tables/CodingTable.js';
import References from './References.js';
import Examples from './Examples.js';
import Characteristics from './Characteristics.js';
import classes from './FieldDetail.module.css';

export default function FieldDetail(props) {
  const field = props.data
  console.log('field',field)
  const rows = []
  const row0 = {
    label: field.label,
    format: {},
    repeat: field.statements.repeat?.occurrences[0].value
  }
  // field.statements.coding.occurrences.map((coding,index) => {
    // let key = coding.qualifiers.type.occurrences[0].label
    // row0['format'][key] = coding.value
  // })
  for (const [key, value] of Object.entries(field.statements.encoding.format)) {
    // console.log(`${key}: ${value}`)
    row0['format'][key] = value
  }
  // field.statements.coding.format.map((coding,index) => {
    // let key = coding.qualifiers.type.occurrences[0].label
    // row0['format'][key] = coding.value
  // })
  rows.push(row0)
  field.statements.subfields?.occurrences.map((subfield,index) => {
    let row = {
      label: subfield.label,
      format: {},
      repeat: subfield.qualifiers?.repeat?.occurrences[0].value
    }
    for (const [key, value] of Object.entries(subfield.coding.format)) {
      // console.log(`${key}: ${value}`)
      row['format'][key] = value
    }
    // subfield.coding.occurrences.map((coding,index) => {
      // let key = coding.qualifiers.type.occurrences[0].label
      // row['format'][key] = coding.value
    // })
    rows.push(row)
  })
  // console.log('rows',rows)
  return (
    <>
    <title>{field.label}</title>
    <section className={classes.detail}>
    <h1>{field.label}</h1>
    <h3>{field.statements.definition?.label}</h3>
    {field.statements.definition?.occurrences.map((occurrence,index) => {
      return(
        <p key={index}>{occurrence.value}</p>
      )
    })}
    <CodingTable data={rows} />
    <h3>{field.statements.rulesofuse?.label}</h3>
    {field.statements.rulesofuse?.occurrences.map((occurrence,index) => {
      return(
        <p key={index}>{occurrence.value}</p>
      )
    })}
    <h3>{field.statements.examples?.label}</h3>
    <Examples examples={field.statements.examples}/>
    <h3>{field.statements.validation?.label}</h3>
    {field.statements.validation?.occurrences.map((occurrence,index) => {
      return(
        <p key={index}>{occurrence.value}</p>
      )
    })}
    <h3 id={field.statements.subfields?.label}>{field.statements.subfields?.label}</h3>
    {field.statements.subfields?.occurrences.map((subfield,index) => {
      // console.log('subfield',subfield)
      return(
        <Fragment key={index}>
        <h4 id={subfield.label}>{subfield.label}</h4>
        {subfield.qualifiers?.description?.occurrences.map(desc => <p key={index}>{desc.value}</p>)}
        {subfield.qualifiers?.permittedcharacteristics && <Characteristics characteristics={subfield.qualifiers.permittedcharacteristics}/>}
        <h5>{subfield.qualifiers?.examples?.label}</h5>
        <Examples examples={subfield.qualifiers?.examples}/>
        {subfield.references && <References references={subfield.references}/>}
        </Fragment>
      )
    })}
    </section>
    </>
  )
}
