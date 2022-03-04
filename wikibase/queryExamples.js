import fetchWithCache from '../pages/api/fetchWithCache.js'
import * as constants from '../sparql/queryConstants'
import queryLabel from '../sparql/queryLabel'
import queryCodings from '../sparql/queryCodings'
import queryElements from '../sparql/queryElements'

export default async function queryExamples() {
  // const lookup_en = await fetchWithCache('http://localhost:3000/api/elements/en')
  const lookup_en = await queryElements( constants.QUERYLABELEN )
  // const lookup_de = await fetchWithCache('http://localhost:3000/api/elements/de')
  const lookup_de = await queryLabel( constants.QUERYLABELDE )
  // const codings = await fetchWithCache('http://localhost:3000/api/codings')
  // const elements_with_coding = await fetchWithCache('http://localhost:3000/api/elements/coding')
  const codings = await queryCodings( constants.QUERYCODINGS )
  const exampleIds = await queryElements( constants.QUERYEXAMPLES )
  // const sparqlQuery = constants.QUERYEXAMPLES
  // class SPARQLQueryDispatcher {
    // constructor( endpoint ) {
      // this.endpoint = endpoint;
    // }

    // query( sparqlQuery ) {
      // const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      // const headers = { 'Accept': 'application/sparql-results+json' };
      // return fetchWithCache( fullUrl, { headers } );
    // }
  // }
  // const endpointUrl = 'https://doku.wikibase.wiki/query/proxy/wdqs/bigdata/namespace/wdq/sparql'
  // const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl )
  // // queryDispatcher.query( sparqlQuery ).then(function (response) {
  // // res.status(200).json(response.results.bindings)
  // // })
  // const response = await queryDispatcher.query( sparqlQuery )
  // const bindings = response.results.bindings
  // // console.log('bindings',bindings)
  // const list_examples = {}
  // bindings.map( binding => {
    // var value_strip = binding['elementLabel'].value.toLowerCase().split(" ").join("")
    // // console.log(value_strip)
    // list_examples[binding['eId'].value] = value_strip
  // })
  // console.log('list_examples',list_examples)

  const list_url = []
  Object.keys(exampleIds).map(key => {
    var wikiurl = 'https://doku.wikibase.wiki/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + key
    list_url.push(wikiurl)
  })
  const wiki_res = {}
  const asyncRes = await Promise.all(list_url.map(async (url, index) => {
    const content = await fetchWithCache(url)
    for(let key in content.entities) {
      wiki_res[key] = content.entities[key]
    }
    return
  }))

// This is TODO for refactoring Examples Object
  // const examples = {}
  // for (const [key, example] of Object.entries(wiki_res)) {
    // if (key === 'Q2934') {
      // // console.log(`${key}: ${example}`)
      // // console.log('example',example)
      // // console.log('claims',example.claims['P7'])
      // examples[key] = {}
      // examples[key]['id'] = example['id'].value
      // examples[key]['label'] = example['labels']['de'].value
      // examples[key]['statements'] = {}
    // }
  // }
// TODO
  const obj = {}
  Object.keys(exampleIds).map((key,index) => {
    const element = wiki_res[key]
    // Erste Ebene
    obj[key] = {}
    obj[key]['id'] = element['id']
    obj[key]['label'] = element['labels']['de'].value
    obj[key]['statements'] = {}
    // Zweite Ebene
    Object.keys(element.claims).map(claim_key => {
      obj[key]['statements'][lookup_en[claim_key]] = {}
      obj[key]['statements'][lookup_en[claim_key]]['id'] = claim_key
      obj[key]['statements'][lookup_en[claim_key]]['label'] = lookup_de[claim_key]
      if (codings[claim_key] !== undefined) {
        obj[key]['statements'][lookup_en[claim_key]]['coding'] = codings[claim_key]['coding']
      }
      obj[key]['statements'][lookup_en[claim_key]]['occurrences'] = []
      // Dritte Ebene
      element.claims[claim_key].map((occurrence,index) => {
        // console.log('claim_key',claim_key)
        if (occurrence.mainsnak.snaktype === 'value' && occurrence['mainsnak']['datavalue']['value']['id'] !== undefined) {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index] = {'id':occurrence['mainsnak']['datavalue']['value']['id'],'label':lookup_de[occurrence['mainsnak']['datavalue']['value']['id']]}
        } else if (occurrence['mainsnak']['snaktype'] === 'value' && occurrence['mainsnak']['datavalue']['value'] !== undefined) {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index] = {'value':occurrence['mainsnak']['datavalue']['value']}
        } else {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index] = {'value':''}
        }
        // Vierte Ebene
        if (occurrence['qualifiers'] !== undefined) {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'] = {}
          const qualifiers_arr = Object.keys(occurrence['qualifiers'])
          // console.log('occurrence',occurrence['qualifiers'])
          qualifiers_arr.map((quali_key) => {
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]] = {}
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['label'] = lookup_de[quali_key]
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['id'] = quali_key
            // include coding block, if qualifier is property with coding
            if (codings[quali_key]) {
              obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['coding'] = codings[quali_key]['coding']
            }
            // Fuenfte Ebene
            occurrence['qualifiers'][quali_key].map((quali_value,quali_index) => {
              obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'] = []
              obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][quali_index] = {}
              if (quali_value['datatype'] === 'string') {
                obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = quali_value['datavalue']['value']
              }
              if (quali_value['datatype'] === 'wikibase-item' && quali_value['snaktype'] === 'value') {
                console.log('quali_value',quali_value)
                obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][quali_index]['id'] = quali_value['datavalue']['value']['id']
                obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][quali_index]['value'] = lookup_de[quali_value['datavalue']['value']['id']]
              }
              if (quali_value['datatype'] === 'wikibase-property') {
                let property = quali_value['datavalue']['value']['id']
                if ( codings[property] ) {
                  obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = codings[property]['coding']
                }
              }
              if (quali_value['datavalue'] && quali_value['datavalue']['type'] === 'wikibase-entityid') {
                let property = occurrence['qualifiers'][quali_key][0]['datavalue']['value']['id']
                if ( codings[property] ) {
                  obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = codings[property]['coding']
                }
              }
            })
          })
        }
      })
    })
  })
  return await obj
}
