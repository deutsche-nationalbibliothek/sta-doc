import fetchWithCache from '../pages/api/fetchWithCache.js'
import * as constants from '../sparql/queryConstants'
import queryElements from '../sparql/queryElements'
import queryLabel from '../sparql/queryLabel'
import queryCodings from '../sparql/queryCodings'
import queryExamples from '../wikibase/queryExamples'

export default async function queryField( fieldId ) {
  // const lookup_en = await fetchWithCache('http://localhost:3000/api/elements/en')
  const lookup_en = await queryElements( constants.QUERYLABELEN )
  // const lookup_de = await fetchWithCache('http://localhost:3000/api/elements/de')
  const lookup_de = await queryLabel( constants.QUERYLABELDE )
  // const codings = await fetchWithCache('http://localhost:3000/api/codings')
  const codings = await queryCodings( constants.QUERYCODINGS )
  // const examples = await fetchWithCache('http://localhost:3000/api/examples')
  const examples = await queryExamples( constants.QUERYEXAMPLES )

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
  return await obj
}
