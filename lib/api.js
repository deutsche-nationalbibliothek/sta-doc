import cacheData from 'memory-cache'
import * as sparql from '@/lib/sparql'
const API_URL = 'http://doku.wikibase.wiki'
const endpointUrl = API_URL + '/query/proxy/wdqs/bigdata/namespace/wdq/sparql'

async function fetchWithCache(url, options) {
  const value = cacheData.get(url)
  if (value) {
    return value
  } else {
    const hours = 24
    const res = await fetch(url, options).then(response => response.json())
    if (res.errors) {
      console.error(res.errors)
      throw new Error('Failed to fetch API')
    }
    cacheData.put(url, res, hours * 60 * 60)
    return res
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

export async function getFields() {
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

export async function getRdaProperties() {
  const propertyIds = await getElements( sparql.RDAPROPERTIES )
  const lookup_en = await getElements( sparql.LABELEN )
  const lookup_de = await getLabels( sparql.LABELDE )
  const codings = await getCodings( sparql.CODINGS )
  // let exampleIds = recursiveSearch(property.claims, 'P11')
  // const examples = await getExamples( exampleIds )

  const list_url = []
  Object.keys(propertyIds).map(key => {
    var wikiurl = API_URL + '/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + key
    list_url.push(wikiurl)
  })
  const arr = []
  const asyncRes = await Promise.all(list_url.map(async (url, index) => {
    const content = await fetchWithCache(url)
    for(let key in content.entities) {
      //TODO workaround, use of getField will be replaced in the future
      const obj = await getField( key )
      arr.push(obj)
    }
    return
  }))

  // const data = await fetchWithCache( API_URL + '/w/rest.php/gnd/doku/v1/datafields')
  // const fields = data.fields
  // const rows = []
  // Object.keys(fields).map(key => {
    // // every field needs a Property ID
    // fields[key]['id'] = key
    // rows.push(fields[key])
  // })
  // return rows
  return arr
}

export async function getElements( sparqlQuery ) {
  const response = await queryDispatcher.query( sparqlQuery )
  const bindings = response.results.bindings
  const obj = {}
  bindings.map( binding => {
    var value_strip = binding['elementLabel'].value.toLowerCase().split(" ").join("")
    obj[binding['eId'].value] = value_strip
  })
  return obj
}

export async function getLabels( sparqlQuery ) {
  const response = await queryDispatcher.query( sparqlQuery )
  const bindings = response.results.bindings
  const obj = {}
  bindings.map( binding => {
    var label = binding['elementLabel'].value
    // var strip = label.indexOf(' - ')
    // var strip2= label.indexOf(' – ')
    // if (strip > 0) { label = label.substring(strip+3) }
    // if (strip2 > 0 ) { label = label.substring(strip2+3) }
    obj[binding['eId'].value] = label
  })
  return obj
}

export async function getCodings( sparqlQuery ) {
  const response = await queryDispatcher.query( sparqlQuery )
  const bindings = response.results.bindings
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
    obj[key] = {}
    obj[key]['id'] = obj['id'].value
    obj[key]['label'] = obj['labels']['de'].value
    obj[key]['statements'] = {}
  }
  return obj
}

async function renderEntity(entity) {
  const lookup_en = await getElements( sparql.LABELEN )
  const lookup_de = await getLabels( sparql.LABELDE )
  const codings = await getCodings( sparql.CODINGS )
  var obj = {}
  // first level (OBJ)
  obj['id'] = entity['id']
  obj['label'] = entity['labels']['de'].value
  // second level (OBJ)
  obj['statements'] = {}
  for (const [key, claim] of Object.entries(entity.claims)) {
    obj['statements'][lookup_en[key]] = {}
    obj['statements'][lookup_en[key]]['id'] = key
    obj['statements'][lookup_en[key]]['label'] = lookup_de[key]
    // insert codings if possible (OBJ)
    if (codings[key] !== undefined) {
      obj['statements'][lookup_en[key]]['coding'] = codings[key]['coding']
    }
    // third level (ARR)
    obj['statements'][lookup_en[key]]['occurrences'] = []
    claim.map((occ,index) => {
      if (occ.mainsnak.snaktype === 'value' && occ['mainsnak']['datavalue']['value']['id'] !== undefined) {
        obj['statements'][lookup_en[key]]['occurrences'][index] = {
          'id':occ['mainsnak']['datavalue']['value']['id'],
          'label':lookup_de[occ['mainsnak']['datavalue']['value']['id']]
        }
      } else if (occ['mainsnak']['snaktype'] === 'value' && occ['mainsnak']['datavalue']['value'] !== undefined) {
        obj['statements'][lookup_en[key]]['occurrences'][index] = {
          'value':occ['mainsnak']['datavalue']['value']
        }
      } else {
        obj['statements'][lookup_en[key]]['occurrences'][index] = {'value':''}
      } 
      // fourth level (OBJ)
      if (occ['qualifiers'] !== undefined) {
        obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'] = {}
        for (const [key4, qualifier] of Object.entries(occ.qualifiers)) {
          obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[key4]] = {}
          obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[key4]]['label'] = lookup_de[key4]
          obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[key4]]['id'] = key4
          // insert codings if possible (OBJ)
          if (codings[key4]) {
            obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[key4]]['coding'] = codings[key4]['coding']
          }
          // fifth level (ARR)
          qualifier.map((quali_value,quali_index) => {
            if (quali_value['datatype'] === 'string') {
              obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[key4]]['value'] = quali_value['datavalue']['value']
            }
            if (quali_value['datatype'] === 'wikibase-item' && quali_value['snaktype'] === 'value') {
              obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[key4]]['value'] = { 
                id: quali_value['datavalue']['value']['id'], 
                label: lookup_de[quali_value['datavalue']['value']['id']]
              }
            }
            if (quali_value['datatype'] === 'wikibase-property' && quali_value['snaktype'] === 'value') {
              let property = quali_value['datavalue']['value']['id']
              if ( codings[property] ) {
                obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[key4]]['value'] = codings[property]['coding']
              }
            }
            if (quali_value['datavalue'] && quali_value['datavalue']['type'] === 'wikibase-entityid') {
              let property = quali_value['datavalue']['value']['id']
              if ( codings[property] ) {
                obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[key4]]['value'] = codings[property]['coding']
              }
            }
          })
        }
      }
    })
  }
  return obj
}

async function getItems(linkedItems) {
  const itemIds = linkedItems.toString().replace(/,/g,'|')
  // const res = await fetchWithCache(API_URL + '/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + itemIds)
  const res = await fetchWithCache(API_URL + '/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + itemIds)
  let items = {}
  for (const [key, value] of Object.entries(res['entities'])) {
    const entity = await renderEntity(value)
    items[entity.id] = entity
  }
  return items
}

export async function getExample( exampleId ) {
  const lookup_en = await getElements( sparql.LABELEN )
  const lookup_de = await getLabels( sparql.LABELDE )
  const codings = await getCodings( sparql.CODINGS )
  const res = await fetchWithCache(API_URL + '/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + exampleId)
  const element = res.entities[exampleId]
  const items = []
  items = await getItems(linkedItems)
  // first level
  const obj = {}
  obj['id'] = element['id']
  obj['label'] = element['labels']['de'].value
  // second level
  obj['statements'] = {}
  Object.keys(element.claims).map((claim_key) => {
    obj['statements'][lookup_en[claim_key]] = {}
    obj['statements'][lookup_en[claim_key]]['id'] = claim_key
    obj['statements'][lookup_en[claim_key]]['label'] = lookup_de[claim_key]
    if (codings[claim_key] !== undefined) {
      obj['statements'][lookup_en[claim_key]]['coding'] = codings[claim_key]['coding']
    }
    obj['statements'][lookup_en[claim_key]]['occurrences'] = []
    // third level
    element.claims[claim_key].map((occurrence,index) => {
      if (occurrence.mainsnak.snaktype === 'value' && occurrence['mainsnak']['datavalue']['value']['id'] !== undefined) {
        obj['statements'][lookup_en[claim_key]]['occurrences'][index] = {'id':occurrence['mainsnak']['datavalue']['value']['id'],'label':lookup_de[occurrence['mainsnak']['datavalue']['value']['id']]}
      } else if (occurrence['mainsnak']['snaktype'] === 'value' && occurrence['mainsnak']['datavalue']['value'] !== undefined) {
        obj['statements'][lookup_en[claim_key]]['occurrences'][index] = {'value':occurrence['mainsnak']['datavalue']['value']}
      } else {
        obj['statements'][lookup_en[claim_key]]['occurrences'][index] = {'value':''}
      }
      // fourth level
      if (occurrence['qualifiers'] !== undefined) {
        obj['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'] = {}
        const qualifiers_arr = Object.keys(occurrence['qualifiers'])
        qualifiers_arr.map(async (quali_key) => {
          obj['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]] = {}
          obj['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['label'] = lookup_de[quali_key]
          obj['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['id'] = quali_key
          // include coding block, if qualifier is property with coding
          if (codings[quali_key]) {
            obj['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['coding'] = codings[quali_key]['coding']
          }
          // fifth level
          let linkedItems = []
          occurrence['qualifiers'][quali_key].map((quali_value,quali_index) => {
            if (quali_value['property'] === 'P396' || quali_value['property'] === 'P411') {
              linkedItems.push(quali_value['datavalue']['value']['id'])
            }
          })
          if (linkedItems.length > 0) {
            let items = []
            items = await getItems(linkedItems)
            obj['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'] = items
          }
          occurrence['qualifiers'][quali_key].map((quali_value,quali_index) => {
            if (quali_value['datatype'] === 'string') {
              obj['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = quali_value['datavalue']['value']
            }
            if (quali_value['datatype'] === 'wikibase-item' && quali_value['snaktype'] === 'value') {
              obj['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = { 
                id: quali_value['datavalue']['value']['id'], 
                label: lookup_de[quali_value['datavalue']['value']['id']]
              }
            }
            if (quali_value['datatype'] === 'wikibase-property' && quali_value['snaktype'] === 'value') {
              let property = quali_value['datavalue']['value']['id']
              if ( codings[property] ) {
                obj['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = codings[property]['coding']
              }
            }
            if (quali_value['datavalue'] && quali_value['datavalue']['type'] === 'wikibase-entityid') {
              let property = occurrence['qualifiers'][quali_key][0]['datavalue']['value']['id']
              if ( codings[property] ) {
                obj['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = codings[property]['coding']
              }
            }
          })
        })
      }
    })
  })
  return obj
}

export async function getExamples( exampleIds ) {
  const lookup_en = await getElements( sparql.LABELEN )
  const lookup_de = await getLabels( sparql.LABELDE )
  const codings = await getCodings( sparql.CODINGS )
  // const descriptions = await getDescriptions( sparql.DESCRIPTIONS )
  // const exampleIds = await getElements( sparql.EXAMPLES )
  const list_url = []
  exampleIds.map(key => {
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

  let itemIds = recursiveSearch(wiki_res, 'P396')
  let items = {}
  if( itemIds.length > 0 ) {  
    items = await getItems( itemIds )
  }
// This is TODO for refactoring Examples Object
  // const examples = {}
  // for (const [key, example] of Object.entries(wiki_res)) {
    // if (key === 'Q2934') {
      // examples[key] = {}
      // examples[key]['id'] = example['id'].value
      // examples[key]['label'] = example['labels']['de'].value
      // examples[key]['statements'] = {}
    // }
  // }
// TODO
  const obj = {}
  exampleIds.map((key,index) => {
    const element = wiki_res[key]
    // first level
    obj[key] = {}
    obj[key]['id'] = element['id']
    obj[key]['label'] = element['labels']['de'].value
    // second level
    obj[key]['statements'] = {}
    Object.keys(element.claims).map(claim_key => {
      obj[key]['statements'][lookup_en[claim_key]] = {}
      obj[key]['statements'][lookup_en[claim_key]]['id'] = claim_key
      obj[key]['statements'][lookup_en[claim_key]]['label'] = lookup_de[claim_key]
      if (codings[claim_key] !== undefined) {
        obj[key]['statements'][lookup_en[claim_key]]['coding'] = codings[claim_key]['coding']
      }
      obj[key]['statements'][lookup_en[claim_key]]['occurrences'] = []
      // third level
      element.claims[claim_key].map((occurrence,index) => {
        if (occurrence.mainsnak.snaktype === 'value' && occurrence['mainsnak']['datavalue']['value']['id'] !== undefined) {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index] = {'id':occurrence['mainsnak']['datavalue']['value']['id'],'label':lookup_de[occurrence['mainsnak']['datavalue']['value']['id']]}
        } else if (occurrence['mainsnak']['snaktype'] === 'value' && occurrence['mainsnak']['datavalue']['value'] !== undefined) {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index] = {'value':occurrence['mainsnak']['datavalue']['value']}
        } else {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index] = {'value':''}
        }
        // fourth level
        if (occurrence['qualifiers'] !== undefined) {
          obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'] = {}
          const qualifiers_arr = Object.keys(occurrence['qualifiers'])
          qualifiers_arr.map((quali_key) => {
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]] = {}
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['label'] = lookup_de[quali_key]
            obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['id'] = quali_key
            // include coding block, if qualifier is property with coding
            if (codings[quali_key]) {
              obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['coding'] = codings[quali_key]['coding']
            }
            // fifth level
            occurrence['qualifiers'][quali_key].map((quali_value,quali_index) => {
              obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'] = []
              if (quali_value['datatype'] === 'string') {
                obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = quali_value['datavalue']['value']
              }
              if (quali_value['datatype'] === 'wikibase-item' && quali_value['snaktype'] === 'value') {
                obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['value'] = { 
                  id: quali_value['datavalue']['value']['id'], 
                  label: lookup_de[quali_value['datavalue']['value']['id']]
                }
              }
              if (quali_value['property'] === 'P396' || quali_value['property'] === 'P411') {
                obj[key]['statements'][lookup_en[claim_key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][quali_index] = items[quali_value['datavalue']['value']['id']]
              }
              if (quali_value['datatype'] === 'wikibase-property' && quali_value['snaktype'] === 'value') {
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

const recursiveSearch = (obj, searchKey, results = []) => {
  const r = results;
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if(key === searchKey && typeof value !== 'array'){
      value.map(obj => { 
        if(obj['mainsnak']) {r.push(obj['mainsnak']['datavalue']['value']['id'])}
        if(obj['datavalue']) {r.push(obj['datavalue']['value']['id'])}
      })
    }
    else if(typeof value === 'object'){
      recursiveSearch(value, searchKey, r);
    }
  });
  return r;
};  

export async function getField( fieldId ) {
  const lookup_en = await getElements( sparql.LABELEN )
  const lookup_de = await getLabels( sparql.LABELDE )
  const codings = await getCodings( sparql.CODINGS )
  // const examples = await getExamples( sparql.EXAMPLES )
  const wikiurl = API_URL + '/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + fieldId
  const wikiapi = await fetchWithCache(wikiurl)
  const property = wikiapi.entities[fieldId]
  let exampleIds = recursiveSearch(property.claims, 'P11')
  const examples = await getExamples( exampleIds )

  const obj = {}
  obj['id'] = fieldId
  obj['label'] = property.labels?.de?.value ?? ''
  obj['description'] = property.descriptions?.de?.value ?? ''
  obj['statements'] = {}
  // obj['statementsdraft'] = property.claims
  const statements_arr = Object.keys(property.claims)
  statements_arr.map((key) => {
    obj['statements'][lookup_en[key]] = {}
    obj['statements'][lookup_en[key]]['id'] = key
    obj['statements'][lookup_en[key]]['label'] = lookup_de[key]
    if (key === 'P4') { // integrate coding from codings api
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
      if (key === 'P15') { // integrate coding in subfields (P15) object
        obj['statements'][lookup_en[key]]['occurrences'][index]['coding'] = codings[occurrences_id]['coding']
      }
      if (key === 'P11') { // integrate examples (P11) object if available
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
            let occurrences2_id = undefined
            if(occurrences2['datavalue'] !== undefined) {
              occurrences2_id = occurrences2['datavalue']['value']['id']
              if (occurrences2_id) {
                obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2] = {}
                obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2]['id'] = occurrences2_id
                obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2]['label'] = lookup_de[occurrences2_id]
                if (quali_key === 'P11') {
                  obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2]['statements'] = examples[occurrences2_id]['statements']
                }
              } else {
                obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2] = {'value':occurrences2['datavalue']['value']} 
              }
            }
          })
        })
      }
      const reference_arr = occurrences['references']
      if (reference_arr) {
        obj['statements'][lookup_en[key]]['occurrences'][index]['references'] = []
        reference_arr.map((reference,ref_index) => {
          const ref_keys = Object.keys(reference['snaks'])
          const ref_obj = {}
          ref_keys.map((ref_key) => {
            const ref = {'id':ref_key,'label':lookup_de[ref_key],'value':reference['snaks'][ref_key][0]['datavalue']['value']}
            ref_obj[lookup_en[ref_key]] = ref
          })
          obj['statements'][lookup_en[key]]['occurrences'][index]['references'][ref_index] = ref_obj
        })
      }
    })
  })
  return obj
}
