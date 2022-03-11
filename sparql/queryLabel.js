import fetchWithCache from '../cache/fetchWithCache.js'

export default async function sparql( sparqlQuery ) {
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
    obj[binding['eId'].value] = binding['elementLabel'].value
  })
  return await obj
}
