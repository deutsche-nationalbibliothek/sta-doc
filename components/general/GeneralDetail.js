import { Fragment } from 'react';
import CodingTable from '@/components/tables/CodingTable.js';
import References from '@/components/fields/References.js';
import Examples from '@/components/fields/Examples.js';
import Characteristics from '@/components/fields/Characteristics.js';
import BasicRules from '@/components/rda/BasicRules.js';
import styles from './GeneralDetail.module.css';
import { sortStatements } from '@/lib/api'

export default function GeneralDetail(props) {
  const field = props.data
  const sorted_statements = sortStatements(field.statements)
  const rows = []
  const row0 = {
    label: field?.label ?? '',
    format: {},
    repetition: field.statements.repetition?.occurrences[0].value
  }
  if(field.statements.encoding){
    for (const [key, value] of Object.entries(field.statements.encoding.format)) {
      // console.log(`${key}: ${value}`)
      row0['format'][key] = value
    }
    rows.push(row0)
    field.statements.subfields?.occurrences.map((subfield,index) => {
      let row = {
        label: subfield.label ?? '',
        format: {},
        repetition: subfield.qualifiers?.repetition?.occurrences[0].value
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
  }
  // console.log('rows',rows)
  const view = []
  view.push(
    <h1>{field.label} ({field.id})</h1>,
    <p>{field.description}</p>,
    <hr/>
  )
  for (const [key, statement] of Object.entries(sorted_statements)) {
    // console.log(key, statement)
    view.push(<h2>{statement.label} ({statement.id})</h2>)
    if (statement.id === 'P388') { //Basisregeln
      view.push(<BasicRules key={statement.id} basicrules={statement}/>)
    } 
    else {
      statement.occurrences.map((occ, index) => {
        console.log('key',key)
        console.log('occ',occ)
        if(occ.value){
          view.push(<p key={index}>{occ.value}</p>)
        }
        if(occ.id){
          view.push(<p key={index}>{occ.label} ({occ.id})</p>)
        }
        if(occ.qualifiers){
          for (const [key, qualifier] of Object.entries(occ.qualifiers)) {
            console.log('quali',key,qualifier)
            if (qualifier.id === 'P396') {
              // view.push(<Examples examples={qualifier} />)
            }
          }
        }
      })
    }
  }


  return (
    <>
    <title>{field.label}</title>
    <section className={styles.detail}>
      {view.map( html => html )}
    </section>
    </>
  )
}
