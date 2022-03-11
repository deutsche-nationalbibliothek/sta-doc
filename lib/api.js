import cacheData from 'memory-cache'
import * as sparql from '@/lib/sparql'
const API_URL = 'https://doku.wikibase.wiki'
const endpointUrl = API_URL + '/query/proxy/wdqs/bigdata/namespace/wdq/sparql'

async function fetchWithCache(url, options) {
  const value = cacheData.get(url)
  if (value) {
    return value
  } else {
    const hours = 24
    const res = await fetch(url, options)
    // console.log('res',res)
    const json = await res.json()
    if (json.errors) {
      console.error(json.errors)
      throw new Error('Failed to fetch API')
    }
    cacheData.put(url, json, hours * 60 * 60)
    return json
  }
}

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
const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl )

export async function getFieldList() {
  const data = await fetchWithCache( API_URL + '/w/rest.php/gnd/doku/v1/datafields')
  const fields = data.fields
  const rows = []
  Object.keys(fields).map(key => {
    // every field needs a Property ID
    fields[key]['id'] = key
    rows.push(fields[key])
  })
  return rows
}

export async function getElements( sparqlQuery ) {
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
  return obj
}

export async function getLabel( sparqlQuery ) {
  const response = await queryDispatcher.query( sparqlQuery )
  const bindings = response.results.bindings
  // console.log('bindings',bindings)
  const obj = {}
  bindings.map( binding => {
    obj[binding['eId'].value] = binding['elementLabel'].value
  })
  // console.log('obj',obj)
  return obj
}

export async function getCodings( sparqlQuery ) {
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
  return obj
}

async function getDescriptions() {
  const descriptionIds = await getElements( sparql.DESCRIPTIONS )

  const list_url = []
  Object.keys(descriptionIds).map(key => {
    var wikiurl = API_URL + '/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + key
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

  const obj = {}
  for (const [key, obj] of Object.entries(wiki_res)) {
    // console.log(`${key}: ${obj}`)
    // console.log('obj',obj)
    // console.log('claims',obj.claims['P7'])
    obj[key] = {}
    obj[key]['id'] = obj['id'].value
    obj[key]['label'] = obj['labels']['de'].value
    obj[key]['statements'] = {}
  }
  return obj
}

async function getItems(linkedItems) {
  const itemIds = linkedItems.toString().replace(/,/g,'|')
  const lookup_en = await getElements( sparql.LABELEN )
  const lookup_de = await getLabel( sparql.LABELDE )
  // const res = await fetchWithCache(API_URL + '/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + itemIds)
  const res = await fetchWithCache(API_URL + '/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + 'Q3094')
  let items = []
  for (const [key, item] of Object.entries(res['entities'])) {
    console.log('key', key)
    console.log('item', item)

  }
  // console.log('itemIds',itemIds)
  return items
}

export async function getExamples() {
  const lookup_en = await getElements( sparql.LABELEN )
  const lookup_de = await getLabel( sparql.LABELDE )
  const codings = await getCodings( sparql.CODINGS )
  // const descriptions = await getDescriptions( sparql.DESCRIPTIONS )
  const exampleIds = await getElements( sparql.EXAMPLES )

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
          qualifiers_arr.map(async (quali_key) => {
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]] = {}
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['label'] = lookup_de[quali_key]
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['id'] = quali_key
            // include coding block, if qualifier is property with coding
            if (codings[quali_key]) {
              obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['coding'] = codings[quali_key]['coding']
            }
            // Fuenfte Ebene
            // const items = await Promise.all(occurrence['qualifiers'][quali_key].map(async (quali_value) => {
                // if (quali_value['datatype'] === 'wikibase-item' && quali_value['snaktype'] === 'value') {
                  // // console.log('item',quali_value['datavalue']['value']['id'])
                  // const item = await getItem(quali_value['datavalue']['value']['id'])
                // }
              // return
            // }))
            // console.log('items',items)
            let linkedItems = []
            occurrence['qualifiers'][quali_key].map((quali_value,quali_index) => {
              if (quali_value['datatype'] === 'wikibase-item' && quali_value['snaktype'] === 'value') {
                linkedItems.push(quali_value['datavalue']['value']['id'])
              }
            })
            let items = []
            if (linkedItems.length > 0) {
              items = await getItems(linkedItems)
              // console.log('items',items)
            }
            occurrence['qualifiers'][quali_key].map((quali_value,quali_index) => {
              // obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'] = []
              // obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][quali_index] = {}
              if (quali_value['datatype'] === 'string') {
                obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = quali_value['datavalue']['value']
              }
              if (quali_value['datatype'] === 'wikibase-item' && quali_value['snaktype'] === 'value') {
                // const resp = await Promise.all(getItem(quali_value['datavalue']['value']['id']))
                // console.log('resp',resp)
                // const item = await getItem(quali_value['datavalue']['value']['id'])
                // console.log('item',item)
                obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = { 
                  id: quali_value['datavalue']['value']['id'], 
                  label: lookup_de[quali_value['datavalue']['value']['id']],
                  items: items
                }
              }
              if (quali_value['datatype'] === 'wikibase-property' && quali_value['snaktype'] === 'value') {
                // console.log('quali_value',quali_value)
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
  return obj
}

export async function getField( fieldId ) {
  const lookup_en = await getElements( sparql.LABELEN )
  const lookup_de = await getLabel( sparql.LABELDE )
  const codings = await getCodings( sparql.CODINGS )
  const examples = await getExamples( sparql.EXAMPLES )

  // const { fieldId } = req.query
  const wikiurl = 'https://doku.wikibase.wiki/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + fieldId
  // console.log( fieldId, wikiurl )
  const wikiapi = await fetchWithCache(wikiurl)
  const property = wikiapi.entities[fieldId]

  const obj = {}
  obj['label'] = property['labels']['de'].value
  obj['description'] = property['descriptions']['de']?.value
  obj['statements'] = {}
  // obj['statementsdraft'] = property.claims
  const statements_arr = Object.keys(property.claims)
  statements_arr.map(key => {
    // console.log(key,lookup_en[key])
    obj['statements'][lookup_en[key]] = {}
    obj['statements'][lookup_en[key]]['id'] = key
    obj['statements'][lookup_en[key]]['label'] = lookup_de[key]
    if (key === 'P4') { //integrate coding from codings api
      obj['statements'][lookup_en[key]]['format'] = {}
      obj['statements'][lookup_en[key]]['format'] = codings[fieldId]['coding']['format']
    }
    obj['statements'][lookup_en[key]]['occurrences'] = []
    const occurrences_arr =  property.claims[key]
    occurrences_arr.map((occurrences,index) => {
      const occurrences_id = occurrences['mainsnak']['datavalue']['value']['id']
      if (occurrences_id) {
        obj['statements'][lookup_en[key]]['occurrences'][index] = {'id':occurrences_id,'label':lookup_de[occurrences_id]}
      } else {
        obj['statements'][lookup_en[key]]['occurrences'][index] = {'value':occurrences['mainsnak']['datavalue']['value']}
      }
      // integrate coding in subfields (P15) object
      if (key === 'P15') {
        obj['statements'][lookup_en[key]]['occurrences'][index]['coding'] = codings[occurrences_id]['coding']
      }
      // integrate examples (P11) object if available
      if (key === 'P11' && examples[occurrences_id]) {
        // console.log('log',key,index,occurrences_id)
        obj['statements'][lookup_en[key]]['occurrences'][index]['statements'] = examples[occurrences_id]['statements']
      }
      const qualifiers = occurrences['qualifiers']
      if (qualifiers) {
        obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'] = {}
        const qualifiers_arr = Object.keys(occurrences['qualifiers'])
        qualifiers_arr.map((quali_key,quali_index) => {
          obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]] = {}
          obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['label'] = lookup_de[quali_key]
          obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['id'] = quali_key
          obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'] = []
          const occurrences_arr2 = qualifiers[quali_key]
          occurrences_arr2.map((occurrences2,index2) => {
            const occurrences2_id = occurrences2['datavalue']['value']['id']
            if (occurrences2_id) {
              obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2] = {'id':occurrences2_id,'label':lookup_de[occurrences2_id]}
              // integrate examples (P11) objects if available
              if (quali_key === 'P11' && examples[occurrences2_id]) {
                obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2] = {'id':occurrences2_id,'statements':examples[occurrences2_id]['statements']}
              }
            } else {
              obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2] = {'value':occurrences2['datavalue']['value']} 
            }
          })
        })
      }
      const reference_arr = occurrences['references']
      if (reference_arr) {
        obj['statements'][lookup_en[key]]['occurrences'][index]['references'] = []
        reference_arr.map((reference,ref_index) => {
          // console.log(ref_index)
          const ref_keys = Object.keys(reference['snaks'])
          // console.log(ref_keys)
          const ref_obj = {}
          ref_keys.map((ref_key) => {
            const ref = {'id':ref_key,'label':lookup_de[ref_key],'value':reference['snaks'][ref_key][0]['datavalue']['value']}
            ref_obj[lookup_en[ref_key]] = ref
            // obj['statements'][lookup_en[key]]['occurrences'][index]['references'][ref_index][lookup_en[ref_key]]['label'] = lookup_de[ref_key]
            // obj['statements'][lookup_en[key]]['occurrences'][index]['references'][ref_index][lookup_en[ref_key]]['id'] = ref_key
            // obj['statements'][lookup_en[key]]['occurrences'][index]['references'][ref_index][lookup_en[ref_key]]['value'] = reference['snaks'][ref_key][0]['datavalue']['value']
          })
          obj['statements'][lookup_en[key]]['occurrences'][index]['references'][ref_index] = ref_obj
        })
      }
    })
  })
  return obj
}
