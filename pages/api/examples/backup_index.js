import fetchWithCache from '../fetchWithCache.js'

async function handler(req, res) {
  const lookup_en = await fetchWithCache('http://localhost:3000/api/elements/en')
  const lookup_de = await fetchWithCache('http://localhost:3000/api/elements/de')
  const codings = await fetchWithCache('http://localhost:3000/api/codings')
  // const elements_with_coding = await fetchWithCache('http://localhost:3000/api/elements/coding')
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
  const sparqlQuery = `PREFIX wd: <http://www.wikidata.org/entity/>
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

        SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
                  { ?element prop:P2 item:Q14 . } #Element von: DACH-Dokumentation: Beispiel
                  #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
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
  const list_examples = {}
  bindings.map( binding => {
    var value_strip = binding['elementLabel'].value.toLowerCase().split(" ").join("")
    // console.log(value_strip)
    list_examples[binding['eId'].value] = value_strip
  })
  // console.log('list_examples',list_examples)

  const list_url = []
  Object.keys(list_examples).map(key => {
    var wikiurl = 'https://doku.wikibase.wiki/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + key
    list_url.push(wikiurl)
  })
  // console.log(list_url)
  const wiki_res = {}
  const asyncRes = await Promise.all(list_url.map(async (url, index) => {
    const content = await fetch(url).then( body => body.json() )
    for(let key in content.entities) {
      wiki_res[key] = content.entities[key]
    }
    return
  }))

  const examples = {}
  for (const [key, example] of Object.entries(wiki_res)) {
    if (key === 'Q2934') {
      // console.log(`${key}: ${example}`)
      // console.log('example',example)
      // console.log('claims',example.claims['P7'])
      examples[key] = {}
      examples[key]['id'] = example['id'].value
      examples[key]['label'] = example['labels']['de'].value
      examples[key]['statements'] = {}
    }
  }

  const obj = {}
  // console.log('examples',list_examples)
  Object.keys(list_examples).map((key,index) => {
    // const { codingId } = req.query
    const element = wiki_res[key]
    // Erste Ebene
    if (key === 'Q2934') {
      var template = ['wsz', 'asa', 'xssa', 'casde', 'asad', 'asd']
      var data1 = ['asd', 'asa','wsz', 'xssa', 'asad', 'casde']
      var data2 = ['asd', 'asa','wsz']
      function sortFunc(a, b) {
          return template.indexOf(a) - template.indexOf(b)
      }
      data1.sort(sortFunc)
      data2.sort(sortFunc)
      // console.log(data1)
      // console.log(data2)
      // console.log('element claims',element.claims)

    }
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
        if (occurrence['qualifiers'] !== undefined) {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'] = {}
          const qualifiers_arr = Object.keys(occurrence['qualifiers'])
          // console.log('occurrence',occurrence['qualifiers'])
          qualifiers_arr.map((quali_key,quali_index) => {
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]] = {}
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['label'] = lookup_de[quali_key]
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['id'] = quali_key
            if (codings[quali_key]) {
              obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['coding'] = codings[quali_key]['coding']
            }
            if (occurrence['qualifiers'][quali_key][0]['datatype'] === 'string') {
              obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = occurrence['qualifiers'][quali_key][0]['datavalue']['value']
            }
            if (occurrence['qualifiers'][quali_key][0]['datatype'] === 'wikibase-property') {
              let property = occurrence['qualifiers'][quali_key][0]['datavalue']['value']['id']
              obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = codings[property]['coding']
            }
            // if (key === 'Q2934') {
            // console.log('occ qualifiers quali_key',quali_key,occurrence['qualifiers'][quali_key])
            // }
            // console.log('key',key)
            // console.log('datavalue',quali_key,occurrence['qualifiers'][quali_key][0])
            if (occurrence['qualifiers'][quali_key][0]['datavalue'] && occurrence['qualifiers'][quali_key][0]['datavalue']['type'] === 'wikibase-entityid') {
              let property = occurrence['qualifiers'][quali_key][0]['datavalue']['value']['id']
              // console.log('prop',property)
              if ( codings[property] ) {
                obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = codings[property]['coding']
              }
            }
          })
        }
      })
    })
  })
  res.status(200).json(obj)
}
export default handler
