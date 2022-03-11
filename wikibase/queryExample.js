import fetchWithCache from '../cache/fetchWithCache.js'

export default async function queryExample( id ) {
  let url = 'https://doku.wikibase.wiki/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + id
  const content = await fetchWithCache(url)
  const obj = {}
  obj[id] = content.entities[id]
  return await obj
}
