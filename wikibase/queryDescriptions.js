import fetchWithCache from '../cache/fetchWithCache.js'
import * as constants from '../sparql/queryConstants'
// import queryLabel from '../sparql/queryLabel'
// import queryCodings from '../sparql/queryCodings'
import queryElements from '../sparql/queryElements'
// import queryExample from './queryExample'

export default async function queryDescriptions() {
  const descriptionIds = await queryElements( constants.QUERYDESCRIPTIONS )

  const list_url = []
  Object.keys(descriptionIds).map(key => {
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
  return await obj
}
