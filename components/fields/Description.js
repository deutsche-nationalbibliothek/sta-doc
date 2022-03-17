import { Fragment } from 'react'
import classes from './Description.module.css'
import Collapsible from 'react-collapsible'

function DescriptionBox(props) {
  console.log('props',props)
  const description = props.statements.description?.occurrences.map((occ) => <p key={occ}>{occ.value}</p>)
  if (description === undefined) { return null }
  else {
    return(
      <Collapsible
      trigger={props.label}
      triggerWhenOpen={props.label}
      openedClassName={classes.Collapsible}
      triggerClassName={classes.CustomTriggerCSS}
      triggerOpenedClassName={classes.CustomTriggerCSSopen}
      >
      {description}
      </Collapsible>
    )
  }
}

export default function Description(props) {
  const description_arr = []
  let uncounted_list = []
  let counted_list = []
  const embedded_item = []

  const arr = props.description.occurrences
  // console.log('arr ',arr)
  for (let i = 0; i < arr?.length; i++) {
    let qualifiers = arr[i].qualifiers
    if ( qualifiers === undefined) {
      description_arr.push(<p>{arr[i].value}</p>)
    }
    if (qualifiers) {
      for (const [key, value] of Object.entries(qualifiers)) {
        // console.log('for',key,value)
        if (value.id === 'P389') { //Layouttyp
          const expr = value.value.id
          switch (expr) {
            case 'Q3127': //Schriftart kursiv
              description_arr.push(<p className={classes.italic}>{arr[i].value}</p>)
              break
            case 'Q3128': //Schriftart fett
              description_arr.push(<p className={classes.bold}><b>{arr[i].value}</b></p>)
              break
            case 'Q1343': //Zwischenueberschrift erster Ordnung
              description_arr.push(<h5>{arr[i].value}</h5>)
              break
            case 'Q1346': //Zwischenueberschrift zweiter Ordnung
              description_arr.push(<h6>{arr[i].value}</h6>)
              break
            case 'Q1347': //Zwischenueberschrift dritter Ordnung
              description_arr.push(<h7>{arr[i].value}</h7>)
              break
            case 'Q1344': //Aufzaehlung, ungezaehlt
              uncounted_list.push(<li>{arr[i].value}</li>)
              var id_check = arr[i+1]?.qualifiers?.typeoflayout?.value?.id 
              if (id_check !== 'Q1344') {
                description_arr.push(<ul>{uncounted_list.map(li => li)}</ul>)
                uncounted_list = []
              } 
              break
            case 'Q1345': //Aufzaehlung, gezaehlt
              counted_list.push(<li>{arr[i].value}</li>)
              var id_check = arr[i+1]?.qualifiers?.typeoflayout?.value?.id 
              if (id_check !== 'Q1345') {
                description_arr.push(<ol>{counted_list.map(li => li)}</ol>)
                counted_list = []
              } 
              break
          }
        }
        if (value.id === 'P396') {
          value.occurrences?.map((occ,index) => {
            description_arr.push(<DescriptionBox key={index} {...occ} />)
          })
        }
      }
    }
  }
  return (
    <>
    <div className={classes.DescriptionBlock}>
    {description_arr.map(descr => descr)}
    </div>
    </>
  )
}
