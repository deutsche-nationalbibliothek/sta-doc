import Link from 'next/link'
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
import Collapsible from 'react-collapsible'

const WIKIBASE_URL = 'https://doku.wikibase.wiki/entity/'

export default function GeneralDetail(props) {
  const field = props.data
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
    <h1>{field.label} <a target='_blank' rel='noreferrer' href={WIKIBASE_URL+field.id}>&#x270E;</a></h1>
  )
  if (field.statements.definition){
    sorted_statements.pop
    field.statements.definition.occurrences.map(occ => {
      view.push(<p>{occ.value}</p>)
    })
  }
  view.push(
    <hr/>
  )
  if (field.statements.elementof?.occurrences[0].id === 'Q264') { //RDA-Eigenschaft
    let filter_sorted_statements = Object.entries(sorted_statements).filter(([key,value]) => 
      value.id === 'P1' | value.id === 'P402' | value.id === 'P388' | value.id === 'P386' | value.id === 'P410' )
    sorted_statements = Object.fromEntries(filter_sorted_statements)
    view.push(<RdaDetailTable key={field.id} data={field.statements}/>)
  } else if (field.statements.elementof?.occurrences[0].id === 'Q2') { //GND-Datenfeld
    let filter_sorted_statements = Object.entries(sorted_statements).filter(([key,value]) => 
      value.id === 'P1' | value.id === 'P12' | value.id === 'P15' | value.id === 'P9' | value.id === 'P10' )
    sorted_statements = Object.fromEntries(filter_sorted_statements)
    view.push(<CodingTable data={rows} />)
  }
  for (const [key, statement] of Object.entries(sorted_statements)) {
    if (statement.id === 'P1') { //ignore definition
      continue
    } 
    view.push(<h2>{statement.label}</h2>)
    // if (statement.id === 'P388') { //Basisregeln RDF
      // view.push(<BasicRules key={statement.id} data={statement}/>)
    // } 
    if (statement.id === 'P15') { //Unterfelder GND
      view.push(<SubFields key={statement.id} {...statement}/>)
    }
    if (statement.id === 'P11') {
      view.push(<Examples examples={statement}/>)
    }
    else {
      let uncounted_list = []
      let counted_list = []
      const embedded_item = []
      statement.occurrences.map((occ, index) => {
        if (occ.id){
          view.push(<p key={index}>{occ.label} ({occ.id})</p>)
        } 
        if (occ.value && occ.qualifiers === undefined) {
          view.push(<p key={index}>{occ.value}</p>)
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
              occ.value ? view.push(<p key={index}>{occ.value}</p>) : null
              value.occurrences.map(quali => {
                var trigger = <span>{quali.label} &#8744;</span>
                var triggerWhenOpen = <span>&#8743;</span>
                view.push(
                  <Collapsible
                    trigger={trigger}
                    triggerWhenOpen={triggerWhenOpen}
                    openedClassName={styles.Collapsible}
                    triggerClassName={styles.CustomTriggerCSS}
                    triggerOpenedClassName={styles.CustomTriggerCSSopen}
                  >
                    {<GeneralDetail data={quali}/>}
                  </Collapsible>
                )
              })
            }
            if (value.id === 'P392' || value.id === 'P393') { // see(item/property)
              occ.value ? view.push(<p key={index}>{occ.value}</p>) : null
              if (value.occurrences.length>0) {
                value.occurrences.map(quali => {
                  view.push(
                    <p className={styles.bold}>&rArr;&ensp; 
                      <Link href={`/general/${encodeURIComponent(quali.id)}`}>
                        <a>{quali.label}</a>
                      </Link>
                    </p>
                  )
                })
              } else {
                view.push(<p className={styles.bold}>&rArr;&ensp;FEHLENDER LINK</p>)
              }
            }
            if (value.id === 'P11') {
              view.push(<Examples examples={value}/>)
            }
          }
        }
        if (occ.references) {
          view.push(<References references={occ.references}/>)
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
