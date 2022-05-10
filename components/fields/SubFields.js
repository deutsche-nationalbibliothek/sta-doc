import { Fragment } from "react";
import Examples from "@/components/fields/Examples.js";
import Characteristics from "@/components/fields/Characteristics.js";
import References from "@/components/fields/References.js";
// import styles from './BasicRules.module.css'
// import Collapsible from 'react-collapsible'

function SubFieldBox(props) {
  return (
    <Fragment>
      <h3 id={props.label}>{props.label}</h3>
      {props.qualifiers?.description?.occurrences.map((desc) => (
        <p key={props.id}>{desc.value}</p>
      ))}
      {props.qualifiers?.repetition?.occurrences.map((desc) => (
        <p key={props.id}>Unterfeld wiederholbar: {desc.value}</p>
      ))}
      {props.qualifiers?.permittedcharacteristics && (
        <Characteristics
          characteristics={props.qualifiers.permittedcharacteristics}
        />
      )}
      <h4>{props.qualifiers?.examples?.label}</h4>
      <Examples examples={props.qualifiers?.examples} />
      {props.references && <References references={props.references} />}
    </Fragment>
  );
}

export default function SubFields(props) {
  return (
    <>
      {props.occurrences.map((subfield, index) => (
        <SubFieldBox key={index} {...subfield} />
      ))}
    </>
  );
}
