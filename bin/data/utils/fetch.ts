import fetch from 'node-fetch';

const API_URL = 'http://doku.wikibase.wiki';
const endpointUrl = '/query/proxy/wdqs/bigdata/namespace/wdq/sparql';

export const sparqlQueryDispatcher = (sparqlQuery: string) => {
  const headers = {Accept: 'application/sparql-results+json'};
  return fetcher(`${endpointUrl}?query=${encodeURIComponent(sparqlQuery)}`, {
    headers,
  });
};

export const fetcher = async (url: string, options = {}) => {
  const res = await fetch(`${API_URL}/${url}`, options).then((response) =>
    response.json()
  );
  if (res.errors) {
    console.error(res.errors);
    throw new Error('Failed to fetch Wikibase API');
  }
  return res;
};
