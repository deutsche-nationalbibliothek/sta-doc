async function handler(req, res) {
        const lookup_en = await fetch('http://localhost:3000/api/elements/en').then( body => body.json() )
        const lookup_de = await fetch('http://localhost:3000/api/elements/de').then( body => body.json() )

        const { codingId } = req.query
        const wikiurl = 'https://doku.wikibase.wiki/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + codingId
        // console.log( codingId, wikiurl )
        const wikiapi = await fetch(wikiurl).then( body => body.json() )
        const property = wikiapi.entities[codingId]
        const codings =  property.claims['P4']
        // console.log('codings',codings)
        
        const obj = {}
        obj['label'] = property['labels']['de'].value
        obj['coding'] = {}
        obj['coding']['label'] = lookup_de['P4']
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
        // obj['label'] = property['labels']['de'].value
        // obj['description'] = property['descriptions']['de'].value
        // obj['statements'] = {}
        // // obj['statementsdraft'] = property.claims
        // const statements_arr = Object.keys(property.claims)
        // statements_arr.map(key => {
                // // console.log(key,lookup_en[key])
                // obj['statements'][lookup_en[key]] = {}
                // obj['statements'][lookup_en[key]]['label'] = lookup_de[key]
                // obj['statements'][lookup_en[key]]['occurrences'] = []
                // const occurrences_arr =  property.claims[key]
                // occurrences_arr.map((occurrences,index) => {
                        // const occurrences_id = occurrences['mainsnak']['datavalue']['value']['id']
                        // if (occurrences_id) {
                                // obj['statements'][lookup_en[key]]['occurrences'][index] = {'id':occurrences_id,'label':lookup_de[occurrences_id]}
                        // } else {
                                // obj['statements'][lookup_en[key]]['occurrences'][index] = {'value':occurrences['mainsnak']['datavalue']['value']}
                        // }
                        // const qualifiers = occurrences['qualifiers']
                        // if (qualifiers) {
                                // obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'] = {}
                                // const qualifiers_arr = Object.keys(occurrences['qualifiers'])
                                // qualifiers_arr.map((quali_key,quali_index) => {
                                        // obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]] = {}
                                        // obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['label'] = lookup_de[quali_key]
                                        // obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['id'] = quali_key
                                        // obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'] = []
                                        // const occurrences_arr2 = qualifiers[quali_key]
                                        // occurrences_arr2.map((occurrences2,index2) => {
                                                // const occurrences2_id = occurrences2['datavalue']['value']['id']
                                                // if (occurrences2_id) {
                                                        // obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2] = {'id':occurrences2_id,'label':lookup_de[occurrences2_id]}
                                                // } else {
                                                        // obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key]]['occurrences'][index2] = {'value':occurrences2['datavalue']['value']} 

                                                // }
                                        // })
                                // })
                        // }
                        // const reference_arr = occurrences['references']
                        // if (reference_arr) {
                                // obj['statements'][lookup_en[key]]['occurrences'][index]['references'] = []
                                // reference_arr.map((reference,ref_index) => {
                                        // // console.log(ref_index)
                                        // const ref_keys = Object.keys(reference['snaks'])
                                        // // console.log(ref_keys)
                                        // const ref_obj = {}
                                        // ref_keys.map((ref_key) => {
                                                // const ref = {'id':ref_key,'label':lookup_de[ref_key],'value':reference['snaks'][ref_key][0]['datavalue']['value']}
                                                // ref_obj[lookup_en[ref_key]] = ref
                                        // })
                                        // obj['statements'][lookup_en[key]]['occurrences'][index]['references'][ref_index] = ref_obj
                                // })
                        // }
                // })
        // })
        res.status(200).json(obj)
}
export default handler
