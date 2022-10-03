import HtmlReactParser from 'html-react-parser';

export default function CollapsibleWithPreview({ occurance }) {
  return (
    <div>
      <hr />
      {occurance.qualifiers.introductiontext ? (
        <>
          <details>
            <summary>
              {occurance.qualifiers.introductiontext.occurrences[0].value}
            </summary>
            <p>{HtmlReactParser(`<p>${occurance.value}</p>`)}</p>
          </details>
        </>
      ) : (
        <>
          <details>
            <p>{HtmlReactParser(`<p>${occurance.value}</p>`)}</p>
          </details>
          {/* <div className="collapse-module"> */}
          {/*   <p className="collapse" id="collapseExample" aria-expanded="false"> */}
          {/*     {HtmlReactParser(`<p>${occurance.value}</p>`)} */}
          {/*   </p> */}
          {/*   <a */}
          {/*     className="collapsed" */}
          {/*     data-toggle="collapse" */}
          {/*     href="#collapseExample" */}
          {/*     aria-expanded="false" */}
          {/*     aria-controls="collapseExample" */}
          {/*   ></a> */}
          {/* </div> */}
        </>
      )}
      <hr />
    </div>
  );
}
