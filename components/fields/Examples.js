import { Fragment } from 'react'
import classes from './Examples.module.css'
import Description from './Description.js'

function ExampleBox(props) {
  // console.log('props',props)
  // console.log('statements', props.statements)
  // sorting statements for correct order
  var template = [
    // Zugehörigkeit innerhalb der Namensräume
    'P110','P2','P115','P116',
    // Eigenschaften für den Namensraum DACH-Dokumentation
    'P1','P4','P124','P379','P380','P401','P113','P109','P396','P397','P398','P7','P3','P12','P8','P11','P371','P389','P392','P393','P394',
    // Eigenschaften für den Namensraum RDA-Dokumentation
    'P385','P126','P402','P388','P386','P387',
    // Eigenschaften für den Namensraum GND-Datenmodell
    'P14','P15','P9','P10','P60','P13','P16','P132','P329','P382','P383',
    // Datenfelder
    // Idents & Codes
    'P325','P326','P327','P53','P295','P63','P301','P108','P328','P332','P334','P333','P133','P101','P245','P344','P336','P340','P65','P339',
    // Vorzugsbenennungen
    'P58','P90','P391','P91','P93','P94',
    // sonstige identifizierende Merkmale
    'P349','P351','P68','P352','P353','P300','P309','P310','P316','P320','P322',
    // Abweichende Benennungen
    'P59','P96','P95','P97','P99','P98',
    // Beziehungen
    'P55','P56','P70','P71','P89','P72','P73','P80',
    // Quellenangaben und unstrukturierte Beschreibungen
    'P81','P358','P83','P84','P85','P86','P354','P355',
    // Vorzugsbenennungen in anderen Datenbeständen
    'P107','P104','P105','P103','P106',
    // Geschäftsgangsdaten
    'P360','P364','P367','P375','P378','P370'
  ]
  function sortFunc(a, b) {
    let x = a[1].id
    let y = b[1].id
    return template.indexOf(x) - template.indexOf(y)
  }
  const sortKeys = (obj) => {
    return Object.assign(...Object.entries(obj).sort(sortFunc).map(([key, value]) => {
      return {
        [key]: value
      }
    }));
  };
  let sorted_statements = sortKeys(props.statements)
  // console.log('sorted_statements',sorted_statements)
  let example_statements = Object.keys(sorted_statements).filter(statement => 
    statement !== 'elementof' && statement !== 'schema' && statement !== 'entitycode' && statement !== 'description')
  const description = []
  const montageFormatNeutral = []
  const montagePica3 = []
  const montagePicaPlus = []
  if (sorted_statements.description) {
    // description.push(<Description key={props.id} description={sorted_statements.description}/>)
  }
  example_statements.map((statement_key,index) => {
    // console.log('statement',props.statements[statement_key])
    let field_format = props.statements[statement_key].coding.format
    props.statements[statement_key].occurrences.map(occurrence => {
      // console.log('statement',occurrence)
      if(occurrence.value !== '') {
        montageFormatNeutral.push(<p className={classes.formatneutral} key={statement_key}>{occurrence.value}</p>)
      }
      if (occurrence.qualifiers) {
        const subfieldMontagePica3 = []
        const subfieldMontagePicaPlus = []
        Object.entries(occurrence.qualifiers).forEach(([key, value]) => {
          // console.log('value', key, value)
          // console.log('key',key)
          if (value.coding) {
            if (value.coding.format['PICA3'] !== '-ohne-' && value.coding.format['PICA3'] !== '!...!') {
              subfieldMontagePica3.push(<b key={key}>{value.coding.format['PICA3']}</b>)
            }
            if (value.coding.format['PICA+'] !== '-ohne-') {
              subfieldMontagePicaPlus.push(<b key={key}>{value.coding.format['PICA+']}</b>)
            }
            // check if qualifier value is a Property
            if (value.value?.format !== undefined) {
              subfieldMontagePica3.push(`${value.value.format['PICA3']}`)
              subfieldMontagePicaPlus.push(`${value.value.format['PICA+']}`)
            } else {
              if (value.coding.format['PICA3'] === '!...!') {
                subfieldMontagePica3.push(<b key={key} className={classes.red}>!</b>)
              }
              subfieldMontagePica3.push(`${value.value}`)
              if (value.coding.format['PICA3'] === '!...!') {
                subfieldMontagePica3.push(<b key={key} className={classes.red}>!</b>)
              }
              subfieldMontagePicaPlus.push(`${value.value}`)
            }
          }
          // render box description 
          if (value.id === 'P7') {
            montagePica3.push(<p className={classes.boxdescription} key={key}>{value.value}</p>)
            montagePicaPlus.push(<p className={classes.boxdescription} key={key}>{value.value}</p>)
          }
        })
        montagePica3.push(<p key={statement_key}><b key={statement_key}>{field_format['PICA3']}</b> {subfieldMontagePica3.map(mont => mont)}</p>)
        montagePicaPlus.push(<p key={statement_key}><b key={statement_key}>{field_format['PICA+']}</b> {subfieldMontagePicaPlus.map(mont => mont)}</p>)
      } else {
        montagePica3.push(<p key={statement_key}><b key={statement_key}>{field_format['PICA3']}</b> {occurrence.value}</p>)
        montagePicaPlus.push(<p key={statement_key}><b key={statement_key}>{field_format['PICA+']}</b> {occurrence.value}</p>)
      }
    })
  })
  // Include reference to corresponding wikibase example item
  let link = "https://doku.wikibase.wiki/wiki/item:" + props.id
  return(
    <>
    {description.map(descr => descr)}
    <h6 className={classes.boxtitle}><a href={link} target="_blank" rel="noopener noreferrer">{props.id}</a></h6>
    {montageFormatNeutral.map(mont => mont)}
    <div className={classes.clearfix}>
    <div className={classes.box}>{
      <>
      <p className={classes.boxtitle}><b>PICA3</b></p>
      {montagePica3.map(mont => mont)}
      </>
    }
    </div>
    <div className={classes.box}>{
      <>
      <p className={classes.boxtitle}><b>PICA+</b></p>
      {montagePicaPlus.map(mont => mont)}
      </>
    }
    </div>
    </div>
    </>
  )
}

function Examples({examples}) {
  if (examples) {
    return(
      <>
      {examples.occurrences.map((example,index) => <ExampleBox key={example.id} listId={index+1} {...example} />)}
      </>
    )
  } else { 
    return null 
  }
}
export default Examples
