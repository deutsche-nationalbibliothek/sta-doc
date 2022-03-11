import fetchWithCache from '../cache/fetchWithCache.js'

export default async function queryCodings( sparqlQuery ) {
  class SPARQLQueryDispatcher {
    constructor( endpoint ) {
      this.endpoint = endpoint;
    }

    query( sparqlQuery ) {
      const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json' };
      return fetchWithCache( fullUrl, { headers } )
    }
  }
  const endpointUrl = 'https://doku.wikibase.wiki/query/proxy/wdqs/bigdata/namespace/wdq/sparql'
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
  // console.log('obj',obj)
  return await obj
}
