import { Fragment } from 'react'
import CodingTable from '@/components/tables/CodingTable'
import RdaDetailTable from '@/components/tables/RdaDetailTable'
import References from '@/components/fields/References'
import Examples from '@/components/fields/Examples'
import Characteristics from '@/components/fields/Characteristics'
import BasicRules from '@/components/rda/BasicRules'
import SubFields from '@/components/fields/SubFields'
import styles from './GeneralDetail.module.css'
import { sortStatements } from '@/lib/api'

export default function GeneralDetail(props) {
  const field = props.data
  console.log('entity',field)
  let sorted_statements = sortStatements(field.statements)
  const rows = []
  const row0 = {
    label: field?.label ?? '',
    format: {},
    repetition: field.statements.repetition?.occurrences[0].value
  }
  if(field.statements.encoding){
    for (const [key, value] of Object.entries(field.statements.encoding.format)) {
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
        row['format'][key] = value
      }
      // subfield.coding.occurrences.map((coding,index) => {
      // let key = coding.qualifiers.type.occurrences[0].label
      // row['format'][key] = coding.value
      // })
      rows.push(row)
    })
  }
  const view = []
  view.push(
    <h1>{field.label} ({field.id})</h1>,
    <p>{field.description}</p>,
    <hr/>
  )
  if(field.statements.elementof?.occurrences[0].id === 'Q264') { //RDA-Eigenschaft
    let filter_sorted_statements = Object.entries(sorted_statements).filter(([key,value]) => 
      value.id === 'P1' | value.id === 'P402' | value.id === 'P388' | value.id === 'P386' | value.id === 'P410' )
    sorted_statements = Object.fromEntries(filter_sorted_statements)
    view.push(<RdaDetailTable key={field.id} data={field.statements}/>)
  } else if(field.statements.elementof?.occurrences[0].id === 'Q2') { //GND-Datenfeld
    let filter_sorted_statements = Object.entries(sorted_statements).filter(([key,value]) => 
      value.id === 'P1' | value.id === 'P12' | value.id === 'P15' | value.id === 'P9' | value.id === 'P10' )
    sorted_statements = Object.fromEntries(filter_sorted_statements)
    view.push(<CodingTable data={rows} />)
  }
  for (const [key, statement] of Object.entries(sorted_statements)) {
    // console.log(key, statement)
    view.push(<h2>{statement.label} ({statement.id})</h2>)
    // console.log('statement',statement)
    if (statement.id === 'P388') { //Basisregeln RDF
      view.push(<BasicRules key={statement.id} data={statement}/>)
    } 
    if (statement.id === 'P15') { //Unterfelder GND
      view.push(<SubFields key={statement.id} {...statement}/>)
    }
    else {
      let uncounted_list = []
      let counted_list = []
      const embedded_item = []
      statement.occurrences.map((occ, index) => {
        if ( occ.qualifiers === undefined) {
          if(occ.id){
            view.push(<p key={index}>{occ.label} ({occ.id})</p>)
          } else {
            view.push(<p key={index}>{occ.value}</p>)
          }
        }
        if(occ.qualifiers){
          for (const [key, value] of Object.entries(occ.qualifiers)) {
            if (value.id === 'P389') { // Layouttyp
              const expr = value.occurrences[0].id
              switch (expr) {
                case 'Q3127': // Schriftart kursiv
                  view.push(<p className={styles.italic}>{occ.value}</p>)
                  break
                case 'Q3128': // Schriftart fett
                  view.push(<p className={styles.bold}><b>{occ.value}</b></p>)
                  break
                case 'Q1343': // Zwischenueberschrift erster Ordnung
                  view.push(<h5>{occ.value}</h5>)
                  break
                case 'Q1346': // Zwischenueberschrift zweiter Ordnung
                  view.push(<h6>{occ.value}</h6>)
                  break
                case 'Q1347': // Zwischenueberschrift dritter Ordnung
                  view.push(<h7>{occ.value}</h7>)
                  break
                case 'Q1344': // Aufzaehlung, ungezaehlt
                  uncounted_list.push(<li>{occ.value}</li>)
                  var id_check = statement.occurrences[index+1]?.qualifiers?.typeoflayout?.occurrences[0]?.id 
                  if (id_check !== 'Q1344') {
                    view.push(<ul>{uncounted_list.map(li => li)}</ul>)
                    uncounted_list = []
                  } 
                  break
                case 'Q1345': // Aufzaehlung, gezaehlt
                  counted_list.push(<li>{occ.value}</li>)
                  var id_check = statement.occurrences[index+1]?.qualifiers?.typeoflayout?.occurrences[0]?.id 
                  if (id_check !== 'Q1345') {
                    view.push(<ol>{counted_list.map(li => li)}</ol>)
                    counted_list = []
                  } 
                  break
              }
            }
            if (value.id === 'P396') { // embedded Item
              // view.push(<Examples examples={qualifier} />)
            }
            if (value.id === 'P393') { // see(property)
              view.push(<p className={styles.bold}><b>{occ.value}</b></p>)
            }
            if (value.id === 'P11') {
              view.push(<Examples examples={value}/>)
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
