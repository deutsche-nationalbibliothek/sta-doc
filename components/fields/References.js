import { Fragment } from 'react';
import classes from './References.module.css';

function ReferenceBox(props) {
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

export default function References({references}) {
  if (references) {
    return(
      <>
      <h5 className={classes.h5}>Referenzen</h5>
      {references.map((ref,index) => <ReferenceBox key={index} {...ref} />)}
      </>
    )
  }
}
