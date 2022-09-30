import Link from "next/link";
import { Fragment } from "react";
import styles from "./Description.module.css";
import Collapsible from "react-collapsible";
import HtmlReactParser from "html-react-parser";

function DescriptionBox(props) {
  // console.log('props',props)
  const description = props.statements.description?.occurrences.map(
    (occ, index) => (
      <div key={index}>{HtmlReactParser(`<p>${occ.value}</p>`)}</div>
    )
  );
  if (description === undefined) {
    return null;
  } else {
    return (
      <Collapsible
        trigger={props.label}
        triggerWhenOpen={props.label}
        openedClassName={styles.Collapsible}
        triggerClassName={styles.CustomTriggerCSS}
        triggerOpenedClassName={styles.CustomTriggerCSSopen}
      >
        {description}
      </Collapsible>
    );
  }
}

export default function Description(props) {
  const description_arr = [];
  let uncounted_list = [];
  let counted_list = [];
  const embedded_item = [];

  const arr = props.description.occurrences;
  // console.log('arr ',arr)
  for (let i = 0; i < arr?.length; i++) {
    let qualifiers = arr[i].qualifiers;
    if (qualifiers === undefined) {
      description_arr.push(HtmlReactParser(`<p>${arr[i].value}</p>`));
    }
    if (qualifiers) {
      for (const [key, value] of Object.entries(qualifiers)) {
        // console.log('for',key,value)
        if (value.id === "P389") {
          // Layouttyp
          // console.log('value',value)
          const expr = value.occurrences[0].id;
          const id_check =
            arr[i + 1]?.qualifiers?.typeoflayout?.occurrences[0]?.id;
          switch (expr) {
            case "Q3127": // Schriftart kursiv
              description_arr.push(
                <p key={i} className={styles.italic}>
                  {arr[i].value}
                </p>
              );
              break;
            case "Q3128": // Schriftart fett
              description_arr.push(
                <p key={i} className={styles.bold}>
                  <b>{arr[i].value}</b>
                </p>
              );
              break;
            case "Q1343": // Zwischenueberschrift erster Ordnung
              description_arr.push(<h5>{arr[i].value}</h5>);
              break;
            case "Q1346": // Zwischenueberschrift zweiter Ordnung
              description_arr.push(<h6>{arr[i].value}</h6>);
              break;
            case "Q1347": // Zwischenueberschrift dritter Ordnung
              description_arr.push(<h7>{arr[i].value}</h7>);
              break;
            case "Q1344": // Aufzaehlung, ungezaehlt
              uncounted_list.push(<li>{arr[i].value}</li>);
              // var id_check =
              //   arr[i + 1]?.qualifiers?.typeoflayout?.occurrences[0]?.id;
              if (id_check !== "Q1344") {
                description_arr.push(<ul>{uncounted_list.map((li) => li)}</ul>);
                uncounted_list = [];
              }
              break;
            case "Q1345": // Aufzaehlung, gezaehlt
              counted_list.push(<li>{arr[i].value}</li>);
              // var id_check =
              //   arr[i + 1]?.qualifiers?.typeoflayout?.occurrences[0]?.id;
              if (id_check !== "Q1345") {
                description_arr.push(<ol>{counted_list.map((li) => li)}</ol>);
                counted_list = [];
              }
              break;
          }
        }
        if (value.id === "P396") {
          // eingebettet Item
          value.occurrences?.map((occ, index) => {
            description_arr.push(<DescriptionBox key={index} {...occ} />);
          });
        }
        if (value.id === "P392" || value.id === "P393") {
          // see(item/property)
          // console.log('descriptionee',qualifiers)
          description_arr.push(<p key={i}>{arr[i].value}</p>);
          value.occurrences?.map((occ, index) => {
            description_arr.push(
              <p key={i} className={styles.bold}>
                &ensp;&ensp;&rArr;&ensp;
                <Link href={occ.link}>
                  <a>{occ.label}</a>
                </Link>
              </p>
            );
          });
        }
      }
    }
  }
  return (
    <>
      <div className={styles.DescriptionBlock}>
        {description_arr.map((descr) => descr)}
      </div>
    </>
  );
}
