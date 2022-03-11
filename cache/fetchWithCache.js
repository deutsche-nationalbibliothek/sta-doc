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
