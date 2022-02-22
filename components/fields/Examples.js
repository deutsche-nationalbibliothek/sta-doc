import { Fragment } from 'react';
import classes from './Examples.module.css';

function ExampleBox(props) {
  // console.log('props',props)
  let example_statements = Object.keys(props.statements).filter(statement => 
    statement !== 'elementof' && statement !== 'schema' && statement !== 'entitycode' && statement !== 'description')
  const montagePica3 = []
  const montagePicaPlus = []
  example_statements.map((statement_key,index) => {
    let field_format = props.statements[statement_key].coding.format
    console.log('field_format',field_format)
    // montagePica3.sort(function(a, b){return b - a})
    props.statements[statement_key].occurrences.map(occurrence => {
      if (occurrence.qualifiers) {
        const subfieldMontagePica3 = []
        const subfieldMontagePicaPlus = []
        Object.entries(occurrence.qualifiers).forEach(([key, value]) => {
          // console.log('key',key)
          // console.log('value',value)
          if (key === 'description') return
          if (value.coding.format['PICA3'] !== '-ohne-' && value.coding.format['PICA3'] !== '!...!') {
            subfieldMontagePica3.push(<b>{value.coding.format['PICA3']}</b>)
          }
          if (value.coding.format['PICA+'] !== '-ohne-') {
            subfieldMontagePicaPlus.push(<b>{value.coding.format['PICA+']}</b>)
          }
          // check if qualifier value is a Property
          if (value.value?.format !== undefined) {
            subfieldMontagePica3.push(`${value.value.format['PICA3']}`)
            subfieldMontagePicaPlus.push(`${value.value.format['PICA+']}`)
          } else {
            if (value.coding.format['PICA3'] === '!...!') {
              subfieldMontagePica3.push(<b className={classes.red}>!</b>)
            }
            subfieldMontagePica3.push(`${value.value}`)
            if (value.coding.format['PICA3'] === '!...!') {
              subfieldMontagePica3.push(<b className={classes.red}>!</b>)
            }
            subfieldMontagePicaPlus.push(`${value.value}`)
          }
        })
        montagePica3.push(<p><b>{field_format['PICA3']}</b> {subfieldMontagePica3.map(mont => mont)}</p>)
        montagePicaPlus.push(<p><b>{field_format['PICA+']}</b> {subfieldMontagePicaPlus.map(mont => mont)}</p>)
      } else {
        montagePica3.push(<p><b>{field_format['PICA3']}</b> {occurrence.value}</p>)
        montagePicaPlus.push(<p><b>{field_format['PICA+']}</b> {occurrence.value}</p>)
      }
    })
  })
  // Include reference to corresponding wikibase example item
  let link = "https://doku.wikibase.wiki/wiki/item:" + props.id
  return(
    <>
    { props.statements.description
      ? <h6>{props.statements.description.occurrences[0].value} (<a href={link} target="_blank" rel="noopener noreferrer">{props.id}</a>)</h6>
      : <h6>Fehlende Beschreibung (<a href={link} target="_blank" rel="noopener noreferrer">{props.id}</a>)</h6>
    }
    <div className={classes.div}>{
      <>
      {montagePica3.map(mont => mont)}
      </>
    }
    </div>
    <div className={classes.div}>{
      <>
      {montagePicaPlus.map(mont => mont)}
      </>
    }
    </div>
    </>
  )
}

function Examples({examples}) {
  // console.log('test',examples)
  if (examples) {
    return(
      <>
      {examples.occurrences.map((example,index) => <ExampleBox key={index} listId={index+1} {...example} />)}
      </>
    )
  } else { 
    return null 
  }
}
export default Examples
