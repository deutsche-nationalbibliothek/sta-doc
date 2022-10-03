import styles from './Examples.module.css';
import Description from './Description';

export default function Examples({ examples }) {
  if (examples) {
    return (
      <>
        <div className={styles.examples}>
          {examples.occurrences.map((example, index) => (
            <>
              <div className={styles.example}>
                <ExampleBox key={example.id} listId={index + 1} {...example} />
              </div>
            </>
          ))}
        </div>
      </>
    );
  } else {
    return null;
  }
}

function ExampleBox(props) {
  // Include reference to corresponding wikibase example item
  const link = 'https://doku.wikibase.wiki/wiki/item:' + props.id;
  // sorting statements for correct order
  const template = [
    // Zugehörigkeit innerhalb der Namensräume
    'P110',
    'P2',
    'P115',
    'P116',
    // Eigenschaften für den Namensraum DACH-Dokumentation
    'P1',
    'P4',
    'P124',
    'P379',
    'P380',
    'P401',
    'P113',
    'P109',
    'P396',
    'P397',
    'P398',
    'P7',
    'P3',
    'P12',
    'P8',
    'P11',
    'P371',
    'P389',
    'P392',
    'P393',
    'P394',
    // Eigenschaften für den Namensraum RDA-Dokumentation
    'P385',
    'P126',
    'P402',
    'P388',
    'P386',
    'P387',
    // Eigenschaften für den Namensraum GND-Datenmodell
    'P14',
    'P15',
    'P9',
    'P10',
    'P60',
    'P13',
    'P16',
    'P132',
    'P329',
    'P382',
    'P383',
    // Datenfelder
    // Idents & Codes
    'P325',
    'P326',
    'P327',
    'P53',
    'P295',
    'P63',
    'P301',
    'P108',
    'P328',
    'P332',
    'P334',
    'P333',
    'P133',
    'P101',
    'P245',
    'P344',
    'P336',
    'P340',
    'P65',
    'P339',
    // Vorzugsbenennungen
    'P58',
    'P90',
    'P391',
    'P91',
    'P93',
    'P94',
    // sonstige identifizierende Merkmale
    'P349',
    'P351',
    'P68',
    'P352',
    'P353',
    'P300',
    'P309',
    'P310',
    'P316',
    'P320',
    'P322',
    // Abweichende Benennungen
    'P59',
    'P96',
    'P95',
    'P97',
    'P99',
    'P98',
    // Beziehungen
    'P55',
    'P56',
    'P70',
    'P71',
    'P89',
    'P72',
    'P73',
    'P80',
    // Quellenangaben und unstrukturierte Beschreibungen
    'P81',
    'P358',
    'P83',
    'P84',
    'P85',
    'P86',
    'P354',
    'P355',
    // Vorzugsbenennungen in anderen Datenbeständen
    'P107',
    'P104',
    'P105',
    'P103',
    'P106',
    // Geschäftsgangsdaten
    'P360',
    'P364',
    'P367',
    'P375',
    'P378',
    'P370',
  ];
  function sortFunc(a, b) {
    const x = a[1].id;
    const y = b[1].id;
    return template.indexOf(x) - template.indexOf(y);
  }
  const sortKeys = (obj: any) => {
    return Object.entries(obj)
      .sort(sortFunc)
      .map(([key, value]) => {
        return {
          [key]: value,
        };
      });
  };
  const sorted_statements = sortKeys(props.statements) as any;
  const example_statements = Object.keys(sorted_statements).filter(
    (statement) =>
      statement !== 'elementof' &&
      statement !== 'schema' &&
      // statement !== "entitycode" &&
      statement !== 'description' &&
      statement !== 'description(attheend)'
  );
  const description = [];
  const montageFormatNeutral = [];
  const montagePica3 = [];
  const montagePicaPlus = [];
  if (sorted_statements.description) {
    description.push(
      <Description key={props.id} description={sorted_statements.description} />
    );
  }
  if (example_statements.length > 0) {
    example_statements.map((statement_key, index) => {
      const field_format =
        props.statements[statement_key]?.coding?.format || undefined;
      const field_label = props.statements[statement_key]?.label || undefined;
      if (field_label !== undefined || field_format !== undefined) {
        props.statements[statement_key].occurrences.map((occurrence) => {
          if (occurrence.value !== '') {
            if (occurrence.qualifiers?.formatneutrallabel) {
              montageFormatNeutral.push(
                <p className={styles.kursiv} key={statement_key}>
                  {
                    occurrence.qualifiers.formatneutrallabel.occurrences[0]
                      .value
                  }
                  :
                </p>
              );
            }
            if (occurrence.qualifiers?.description) {
              montageFormatNeutral.push(
                <p className={styles.boxdescription} key={statement_key}>
                  {occurrence.qualifiers.description.occurrences[0].value}
                </p>
              );
            }
            montageFormatNeutral.push(
              <p className={styles.formatneutral} key={statement_key}>
                {occurrence.value}
              </p>
            );
          }
          if (occurrence.qualifiers) {
            const subfieldMontagePica3 = [];
            const subfieldMontagePicaPlus = [];
            Object.entries(occurrence.qualifiers).forEach(
              ([key, value]: any[]) => {
                if (value.coding) {
                  if (
                    value.coding.format['PICA3'] !== '-ohne-' &&
                    value.coding.format['PICA3'] !== '!...!'
                  ) {
                    subfieldMontagePica3.push(
                      <b key={key}>{value.coding.format['PICA3']}</b>
                    );
                  }
                  if (value.coding.format['PICA+'] !== '-ohne-') {
                    subfieldMontagePicaPlus.push(
                      <b key={key}>{value.coding.format['PICA+']}</b>
                    );
                  }
                  // check if qualifier value is a Property
                  if (
                    value.occurrences.length > 0 &&
                    value.occurrences[0].coding?.format !== undefined
                  ) {
                    subfieldMontagePica3.push(
                      `${value.occurrences[0].coding.format['PICA3']}`
                    );
                    subfieldMontagePicaPlus.push(
                      `${value.occurrences[0].coding.format['PICA+']}`
                    );
                  } else if (value.occurrences.length > 0) {
                    if (value.coding.format['PICA3'] === '!...!') {
                      subfieldMontagePica3.push(
                        <b key={key} className={styles.red}>
                          !
                        </b>
                      );
                    }
                    subfieldMontagePica3.push(`${value.occurrences[0].value}`);
                    if (value.coding.format['PICA3'] === '!...!') {
                      subfieldMontagePica3.push(
                        <b key={key} className={styles.red}>
                          !
                        </b>
                      );
                    }
                    subfieldMontagePicaPlus.push(
                      `${value.occurrences[0].value}`
                    );
                  }
                }
                // render box description
                if (value.id === 'P7') {
                  montagePica3.push(
                    <p className={styles.boxdescription} key={key}>
                      {value.occurrences[0].value}
                    </p>
                  );
                  montagePicaPlus.push(
                    <p className={styles.boxdescription} key={key}>
                      {value.occurrences[0].value}
                    </p>
                  );
                }
              }
            );
            montagePica3.push(
              <p key={statement_key}>
                <b key={statement_key} className="tooltip">
                  {field_format['PICA3']}
                  <span className="tooltiptext">{field_label}</span>
                </b>{' '}
                {subfieldMontagePica3.map((mont) => mont)}
              </p>
            );
            montagePicaPlus.push(
              <p key={statement_key}>
                <b key={statement_key} className="tooltip">
                  {field_format['PICA+']}
                  <span className="tooltiptext">{field_label}</span>
                </b>{' '}
                {subfieldMontagePicaPlus.map((mont) => mont)}
              </p>
            );
          } else {
            montagePica3.push(
              <p key={statement_key}>
                <b key={statement_key} className="tooltip">
                  {field_format['PICA3']}
                  <span className="tooltiptext">{field_label}</span>
                </b>{' '}
                {occurrence.value}
              </p>
            );
            montagePicaPlus.push(
              <p key={statement_key}>
                <b key={statement_key} className="tooltip">
                  {field_format['PICA+']}
                  <span className="tooltiptext">{field_label}</span>
                </b>{' '}
                {occurrence.value}
              </p>
            );
          }
        });
      }
    });
  }
  const picaRender = <></>;
  return (
    <>
      <p>
        <a href={link} target="_blank" rel="noopener noreferrer">
          &#x270E;
        </a>
      </p>
      {description.map((descr) => descr)}
      {montageFormatNeutral?.map((mont) => mont)}
      {example_statements.length > 0 ? (
        <div className={styles.clearfix}>
          <div className={styles.box}>
            {
              <>
                <p className={styles.boxtitle}>
                  <b>PICA3</b>
                </p>
                {montagePica3?.map((mont) => mont)}
              </>
            }
          </div>
          <div className={styles.box}>
            {
              <>
                <p className={styles.boxtitle}>
                  <b>PICA+</b>
                </p>
                {montagePicaPlus?.map((mont) => mont)}
              </>
            }
          </div>
        </div>
      ) : null}
    </>
  );
}
