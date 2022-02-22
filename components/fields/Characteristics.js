import { Fragment } from 'react';
import classes from './Characteristics.module.css';

function CharacteristicsBox(props) {
  const referenceMap = {
    url: (ref) => <a href={ref.value}>{ref.value}</a>,
    default: (ref) => <p>{ref.value}</p>
  }
  return(
    <div className={classes.div}>
    {
      Object.keys(props).map((key,index) => 
        <Fragment key={index}>
        {referenceMap[key] ? referenceMap[key](props[key]) : referenceMap.default(props[key])}
        </Fragment>
      )
    }
    </div>
  )
}

function Characteristics({characteristics}) {
  if (characteristics) {
    return(
      <>
      <h5 className={classes.h5}>{characteristics.label}</h5>
      <ul>
      {characteristics.occurrences.map((value,index) => <li key={index}>{value.label}</li>)}
      </ul>
      </>
    )
  }
}
export default Characteristics
