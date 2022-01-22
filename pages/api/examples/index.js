async function handler(req, res) {
  const lookup_en = await fetch('http://localhost:3000/api/elements/en').then( body => body.json() )
  const lookup_de = await fetch('http://localhost:3000/api/elements/de').then( body => body.json() )
  const codings = await fetch('http://localhost:3000/api/codings').then( body => body.json() )
  class SPARQLQueryDispatcher {
    constructor( endpoint ) {
      this.endpoint = endpoint;
    }

    query( sparqlQuery ) {
      const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json' };
      return fetch( fullUrl, { headers } ).then( body => body.json() );
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
                  { ?element prop:P2 item:Q14 . } #Element von: GND-Beispiel
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
    // console.log(content.entities)
    return
  }))


  const obj = {}
  Object.keys(list_examples).map((key,index) => {
    // const { codingId } = req.query
    const element = wiki_res[key]
    // console.log('element',element)
    // console.log('element_key',key)
    // const codings =  element.claims['P4']
    // console.log('codings',codings)
    obj[key] = {}
    obj[key]['id'] = element['id'].value
    obj[key]['label'] = element['labels']['de'].value
    obj[key]['statements'] = {}
    Object.keys(element.claims).map(claim_key => {
      obj[key]['statements'][lookup_en[claim_key]] = {}
      obj[key]['statements'][lookup_en[claim_key]]['id'] = claim_key
      obj[key]['statements'][lookup_en[claim_key]]['label'] = lookup_de[claim_key]

      if (codings[claim_key] !== undefined) {
        obj[key]['statements'][lookup_en[claim_key]]['coding'] = codings[claim_key]['coding']
      }

      obj[key]['statements'][lookup_en[claim_key]]['occurrences'] = []
      // console.log('claim_obj',element.claims[claim_key])
      element.claims[claim_key].map((occurrence,index) => {
        // console.log('occurrence',occurrence)
        // console.log('claim_key',claim_key)
        if (occurrence.mainsnak.snaktype === 'value' && occurrence['mainsnak']['datavalue']['value']['id'] !== undefined) {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index] = {'id':occurrence['mainsnak']['datavalue']['value']['id'],'label':lookup_de[occurrence['mainsnak']['datavalue']['value']['id']]}
        } else if (occurrence['mainsnak']['snaktype'] === 'value' && occurrence['mainsnak']['datavalue']['value'] !== undefined) {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index] = {'value':occurrence['mainsnak']['datavalue']['value']}
        } else {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index] = {'value':''}
        }

        obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'] = {}
        // occurrence['qualifiers']
        if (occurrence['qualifiers'] !== undefined) {
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
          })
        }
      })
    })


    // obj[key]['coding'] = {}
    // obj[key]['coding']['label'] = lookup_de['P4']
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
  })

  res.status(200).json(obj)
}
export default handler
