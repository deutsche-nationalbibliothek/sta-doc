import { Fragment } from 'react';
import classes from './Description.module.css';

export default function Description(props) {
  const description_arr = []
  let uncounted_list = []
  let counted_list = []
  const embedded_item = []

  const arr = props.description.occurrences
  console.log('arr ',arr)
  for (let i = 0; i < arr?.length; i++) {
    let qualifiers = arr[i].qualifiers
    if ( qualifiers === undefined) {
    description_arr.push(<p>{arr[i].value}</p>)
    }
    if (qualifiers) {
      for (const [key, value] of Object.entries(qualifiers)) {
        console.log('for',key,value)
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
          // const item = queryExample(value.value.id)
          // console.log('item',item)
          description_arr.push(<p>Hier wird ein Item ({value.value.id}) geladen.</p>)

        }
      }
    }
  }
  return (
    <>
    {description_arr.map(descr => descr)}
    </>
  )
}
