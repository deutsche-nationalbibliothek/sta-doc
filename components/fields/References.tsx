import { Fragment } from 'react';
import HtmlReactParser from 'html-react-parser';
import styles from './References.module.css';

function ReferenceBox(props) {
  const referenceMap = {
    url: (ref) => <a href={ref.value}>{ref.value}</a>,
    default: (ref) => HtmlReactParser(`<p>${ref.value}</p>`),
  };
  return (
    <div className={styles.div}>
      {Object.keys(props).map((key, index) => (
        <Fragment key={index}>
          {referenceMap[key]
            ? referenceMap[key](props[key])
            : referenceMap.default(props[key])}
        </Fragment>
      ))}
    </div>
  );
}

export default function References({ references }) {
  if (references) {
    return (
      <>
        <p className={styles.p}>Referenzen</p>
        {references.map((ref, index) => (
          <ReferenceBox key={index} {...ref} />
        ))}
      </>
    );
  }
}
