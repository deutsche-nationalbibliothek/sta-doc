import Link from 'next/link'
import { Fragment } from 'react'
import classes from './Characteristics.module.css'

const ROUTE_GENERAL_ID = "general/[generalId]";
// function CharacteristicsBox(props) {
  // const referenceMap = {
    // url: (ref) => <a href={ref.value}>{ref.value}</a>,
    // default: (ref) => <p>{ref.value}</p>
  // }
  // return(
    // <div className={classes.div}>
    // {
      // Object.keys(props).map((key,index) => 
        // <Fragment key={index}>
        // {referenceMap[key] ? referenceMap[key](props[key]) : referenceMap.default(props[key])}
        // </Fragment>
      // )
    // }
    // </div>
  // )
// }

export default function Characteristics({characteristics}) {
  console.log('carac',characteristics)
  if (characteristics) {
    return(
      <>
        <h5 className={classes.h5}>{characteristics.label}</h5>
        <ul>
          {characteristics.occurrences.map((value,index) => 
          <li key={index}>
            <Link href={`/general/${encodeURIComponent(value.id)}`}>
              <a>{value.label}</a>
            </Link>
          </li>
          )}
        </ul>
      </>
    )
  }
}
            // <Link
              // href={{
                // pathname: '/general/[generalId]',
                // query: { generalId: value.id },
              // }}
            // >
            // </Link>
