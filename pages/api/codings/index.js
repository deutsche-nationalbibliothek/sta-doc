import fetchWithCache from '../../../cache/fetchWithCache.js'

export default async function handler(req, res) {

  class SPARQLQueryDispatcher {
    constructor( endpoint ) {
      this.endpoint = endpoint;
    }

    query( sparqlQuery ) {
      const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json' };
      return fetchWithCache( fullUrl, { headers } );
    }
  }
  const endpointUrl = 'https://doku.wikibase.wiki/query/proxy/wdqs/bigdata/namespace/wdq/sparql'
  const sparqlQuery = `
        PREFIX wd: <http://www.wikidata.org/entity/>
        PREFIX wdt: <http://www.wikidata.org/prop/direct/>
        PREFIX wikibase: <http://wikiba.se/ontology#>
        #PREFIX p: <http://www.wikidata.org/prop/>
        PREFIX ps: <http://www.wikidata.org/prop/statement/>
        PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX bd: <http://www.bigdata.com/rdf#>

        PREFIX p: <https://doku.wikibase.wiki/prop/>
        PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
        PREFIX item: <https://doku.wikibase.wiki/entity/>
        PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
        PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>

        SELECT ?eId ?elementLabel ?codingTypeLabel ?coding  WHERE { # ?element
        ?element p:P4 ?codingProp .
        OPTIONAL{ ?codingProp statement:P4 ?coding . }
        OPTIONAL{ ?codingProp qualifier:P3 ?codingType }
        #OPTIONAL{ ?property prop:P1 ?definition }
        #OPTIONAL{ ?property prop:P15 ?subfields }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],de" }
        BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
        }
        ORDER BY ASC(?elementLabel)
        `
  const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl )
  // queryDispatcher.query( sparqlQuery ).then(function (response) {
  // res.status(200).json(response.results.bindings)
  // })
  const response = await queryDispatcher.query( sparqlQuery )
  const bindings = response.results.bindings
  // console.log('bindings',bindings)
  const obj = {}
  bindings.map( binding => {
    var key = binding['eId'].value
    var key_filter = bindings.filter( binding => binding['eId'].value === key )
    obj[key] = {}
    obj[key]['label'] = binding['elementLabel'].value
    obj[key]['coding'] = {}
    obj[key]['coding']['format'] = {}
    key_filter.map(binding => 
      obj[key]['coding']['format'][binding['codingTypeLabel'].value] = binding['coding'].value
    )
  })
  res.status(200).json(obj)
}
