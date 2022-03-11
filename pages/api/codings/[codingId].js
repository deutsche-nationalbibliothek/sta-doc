import fetchWithCache from '../../../cache/fetchWithCache.js'

export default async function handler(req, res) {
  const lookup_en = await fetchWithCache('http://localhost:3000/api/elements/en')
  const lookup_de = await fetchWithCache('http://localhost:3000/api/elements/de')

  const { codingId } = req.query
  const wikiurl = 'https://doku.wikibase.wiki/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + codingId
  // console.log( codingId, wikiurl )
  const wikiapi = await fetchWithCache(wikiurl)
  const property = wikiapi.entities[codingId]
  const codings =  property.claims['P4']
  // console.log('codings',codings)

  const obj = {}
  obj['label'] = property['labels']['de'].value
  obj['coding'] = {}
  obj['coding']['label'] = lookup_de['P4']

  obj['coding']['format'] = {}
  codings.map((occurrences,index) => {
    if (occurrences['qualifiers']) {
      occurrences['qualifiers']['P3'].map(format => {
        obj['coding']['format'][lookup_de[format['datavalue']['value']['id']]] = {
          'value': occurrences['mainsnak']['datavalue']['value'],
          'id': format['datavalue']['value']['id']
        }
      })
    }
  })

  obj['coding']['occurrences'] = []
  codings.map((occurrences,index) => {
    const occurrences_id = occurrences['mainsnak']['datavalue']['value']['id']
    if (occurrences_id) {
      obj['coding']['occurrences'][index] = {'id':occurrences_id,'label':lookup_de[occurrences_id]}
    } else {
      obj['coding']['occurrences'][index] = {'value':occurrences['mainsnak']['datavalue']['value']}
    }
    const qualifiers = occurrences['qualifiers']
    if (qualifiers) {
      obj['coding']['occurrences'][index]['qualifiers'] = {}
      const qualifiers_arr = Object.keys(occurrences['qualifiers'])
      qualifiers_arr.map((quali_key,quali_index) => {
        obj['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]] = {}
        obj['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['label'] = lookup_de[quali_key]
        obj['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['id'] = quali_key
        obj['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'] = []
        const occurrences_arr2 = qualifiers[quali_key]
        occurrences_arr2.map((occurrences2,index2) => {
          const occurrences2_id = occurrences2['datavalue']['value']['id']
          if (occurrences2_id) {
            obj['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2] = {'id':occurrences2_id,'label':lookup_de[occurrences2_id]}
          } else {
            obj['coding']['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2] = {'value':occurrences2['datavalue']['value']} 

          }
        })
      })
    }
  })
  res.status(200).json(obj)
}
