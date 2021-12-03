
async function handler(req, res) {
        const lookup_en = await fetch('http://localhost:3000/api/list_elements_en').then( body => body.json() )
        const lookup_de = await fetch('http://localhost:3000/api/list_elements_de').then( body => body.json() )

        const { fieldId } = req.query
        const wikiurl = 'https://doku.wikibase.wiki/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + fieldId
        // console.log( fieldId, wikiurl )
        const wikiapi = await fetch(wikiurl).then( body => body.json() )
        const property = wikiapi.entities[fieldId]
        
        const obj = {}
        obj['label'] = property['labels']['de'].value
        obj['description'] = property['descriptions']['de'].value
        obj['statements'] = {}
        obj['statementsdraft'] = property.claims
        const statements_arr = Object.keys(property.claims)
        statements_arr.map(key => {
                // console.log(key,lookup_en[key])
                obj['statements'][lookup_en[key]] = {}
                obj['statements'][lookup_en[key]]['label'] = lookup_de[key]
                obj['statements'][lookup_en[key]]['occurrences'] = {}
                const occurrences_arr =  property.claims[key]
                occurrences_arr.map((occurrences,index) => {
                        obj['statements'][lookup_en[key]]['occurrences'][index] = {}
                        const occurrences_id = occurrences['mainsnak']['datavalue']['value']['id']
                        if (occurrences_id) {
                                obj['statements'][lookup_en[key]]['occurrences'][index]['label'] = lookup_de[occurrences_id]
                                obj['statements'][lookup_en[key]]['occurrences'][index]['id'] = occurrences_id
                        } else {
                                obj['statements'][lookup_en[key]]['occurrences'][index]['value'] = occurrences['mainsnak']['datavalue']['value']
                        }
                        const qualifiers = occurrences['qualifiers']
                        if (qualifiers) {
                                obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'] = {}
                                const qualifiers_arr = Object.keys(occurrences['qualifiers'])
                                qualifiers_arr.map((quali_key,quali_index) => {
                                        obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]] = {}
                                        obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['label'] = lookup_de[quali_key]
                                        obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['id'] = quali_key
                                        // obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]] = qualifiers[quali_key]
                                })
                                obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers_ref'] = qualifiers
                        }
                })
                
                // obj['statements'][key]['value-type'] = property.claims[key][0]['mainsnak']['datavalue']['type']
                // obj['statements'][key]['value'] = ((property.claims[key][0]['mainsnak']['datavalue']['value']['id']) ? 
                        // lookup_en[property.claims[key][0]['mainsnak']['datavalue']['value']['id']] : 
                        // property.claims[key][0]['mainsnak']['datavalue']['value']
                // )
                // obj['statements'][key]['qualifier'] = {}
                // if (property.claims[key].length>1) {
                        // property.claims[key].map( quali => {
                            // obj['statements'][key]['qualifier'][quali['mainsnak']['datavalue']['value']['id']] = {}
                            // if (quali['mainsnak']['datavalue']['value']['id']) {
                                    // console.log(quali['mainsnak']['datavalue']['value']['id'],lookup_en[quali['mainsnak']['datavalue']['value']['id']])
                                    // obj['statements'][key]['qualifier'][quali['mainsnak']['datavalue']['value']['id']]['label'] = lookup_en[quali['mainsnak']['datavalue']['value']['id']] } else {
                                    // obj['statements'][key]['qualifier'][quali['mainsnak']['datavalue']['value']['id']]['label'] = '' }
                        // })
                // }
                // var c = ((a < b) ? 'minor' : 'major')

                // obj['statements'][key] = lookup_en[key]
        })

        
        res.status(200).json(obj)
}
export default handler
