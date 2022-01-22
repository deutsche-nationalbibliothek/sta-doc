import { Fragment } from 'react';
import classes from './Examples.module.css';

function ExampleBox(props) {
  let example_statements = Object.keys(props.statements).filter(statement => 
    statement !== 'elementof' && statement !== 'schema' && statement !== 'entitycode')
  const montage = []
  example_statements.map((statement,index) => {
    statement.occurrences.map(occurrence => {
      Object.keys(statement.coding.format).map(key => {
        montage.push(
          <p><b>{statement.coding.format[key].value}</b>: {
            Object.keys(occurrence.qualifiers).map((quali_key) => {
              <b>{occurrence.qualifiers[quali_key].coding.format[key].value}</b>
                {occurrence.qualifiers[quali_key].value}
            })
          }
          </p>)
      })
    })
  })
  return(
    <div className={classes.div}>
    {
        <Fragment key={index}>
        {montage.map(mont => mont)}
        </Fragment>
    }
    </div>
  )
}
        // <ExampleBox {...example} />

function Examples({examples}) {
  console.log('test',examples)
    examples.occurrences.map((example,index) => {
      // console.log('example',example)
      return(
        <Fragment key={index}>
        <h4>{example.label ? example.label : example.id}</h4>
        </Fragment>
      )
    })
}
export default Examples
