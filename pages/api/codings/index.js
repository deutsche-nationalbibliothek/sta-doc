import fetchWithCache from '../fetchWithCache.js'

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

  // const lookup_en = await fetchWithCache('http://localhost:3000/api/elements/en')
  // const lookup_de = await fetchWithCache('http://localhost:3000/api/elements/de')
  // const elements_with_codings = await fetchWithCache('http://localhost:3000/api/elements/coding')
  // const list_fields = await fetchWithCache('http://localhost:3000/api/fields')
  // const list_subfields = await fetchWithCache('http://localhost:3000/api/subfields')
  // const list_relation_types = await fetchWithCache('http://localhost:3000/api/relation_types')
  // const list = Object.assign({}, list_fields, list_subfields, list_relation_types)
  // // const list = Object.assign({}, elements_with_codings)
  // const list_arr = Object.keys(list)
  // const list_url = []
  // list_arr.map((key) => {
    // var wikiurl = 'https://doku.wikibase.wiki/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + key
    // list_url.push(wikiurl)
  // })
  // // console.log(list_url)
  // const wiki_res = {}
  // const asyncRes = await Promise.all(
    // list_url.map(async (url, index) => {
      // const content = await fetchWithCache(url)
      // for(let key in content.entities) {
        // wiki_res[key] = content.entities[key]
      // }
      // return
    // })
  // )
  // const obj = {}
  // list_arr.map((key,index) => {
    // // const { codingId } = req.query
    // const property = wiki_res[key]
    // // console.log('prop',property)
    // const codings =  property.claims['P4']
    // // console.log('codings',codings)
    // obj[key] = {}
    // obj[key]['label'] = property['labels']['de'].value
    // obj[key]['coding'] = {}
    // obj[key]['coding']['label'] = lookup_de['P4']
    // obj[key]['coding']['format'] = {}
    // codings.map((occurrences,index) => {
      // if (occurrences['qualifiers']) {
        // occurrences['qualifiers']['P3'].map(format => {
          // obj[key]['coding']['format'][lookup_de[format['datavalue']['value']['id']]] = {
            // 'value': occurrences['mainsnak']['datavalue']['value'],
            // 'id': format['datavalue']['value']['id']
          // }
        // })
      // }
    // })
    // obj[key]['coding']['occurrences'] = []
    // codings.map((occurrences,index) => {
      // const occurrences_id = occurrences['mainsnak']['datavalue']['value']['id']
      // if (occurrences_id) {
        // obj[key]['coding']['occurrences'][index] = {'id':occurrences_id,'label':lookup_de[occurrences_id]}
      // } else {
        // obj[key]['coding']['occurrences'][index] = {'value':occurrences['mainsnak']['datavalue']['value']}
      // }
      // const qualifiers = occurrences['qualifiers']
      // if (qualifiers) {
        // obj[key]['coding']['occurrences'][index]['qualifiers'] = {}
        // const qualifiers_arr = Object.keys(occurrences['qualifiers'])
        // qualifiers_arr.map((quali_key,quali_index) => {
          // obj[key]['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]] = {}
          // obj[key]['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['label'] = lookup_de[quali_key]
          // obj[key]['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['id'] = quali_key
          // obj[key]['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'] = []
          // const occurrences_arr2 = qualifiers[quali_key]
          // occurrences_arr2.map((occurrences2,index2) => {
            // const occurrences2_id = occurrences2['datavalue']['value']['id']
            // if (occurrences2_id) {
              // obj[key]['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2] = {'id':occurrences2_id,'label':lookup_de[occurrences2_id]}
            // } else {
              // obj[key]['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2] = {'value':occurrences2['datavalue']['value']} 

            // }
          // })
        // })
      // }
    // })
  // })
  res.status(200).json(obj)
}
