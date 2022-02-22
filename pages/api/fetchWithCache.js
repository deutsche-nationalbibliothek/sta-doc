import cacheData from 'memory-cache'

export default async function fetchWithCache(url, options) {
  const value = cacheData.get(url);
  if (value) {
    return value;
  } else {
    const hours = 24;
    const res = await fetch(url, options);
    const data = await res.json();
    cacheData.put(url, data, hours * 60 * 60);
    return data;
  }
}

// export const lookup_en = await fetchWithCache('http://localhost:3000/api/elements/en')
// export const lookup_de = await fetchWithCache('http://localhost:3000/api/elements/de')
// export const elements_with_coding = await fetchWithCache('http://localhost:3000/api/elements/coding')
// export const codings = await fetchWithCache('http://localhost:3000/api/codings')
// export const examples = await fetchWithCache('http://localhost:3000/api/examples')
// export const list_fields =  await fetchWithCache('http://localhost:3000/api/fields')
// export const list_subfields =  await fetchWithCache('http://localhost:3000/api/subfields')
// export const list_relation_types = await fetchWithCache('http://localhost:3000/api/relation_types')
