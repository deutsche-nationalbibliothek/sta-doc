import fetchWithCache from '../pages/api/fetchWithCache.js'

export default async function queryElements( sparqlQuery ) {
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
    var value_strip = binding['elementLabel'].value.toLowerCase().split(" ").join("")
    // console.log(value_strip)
    obj[binding['eId'].value] = value_strip
  })
  // console.log('obj',obj)
  return await obj
}
