import fetch from 'node-fetch';
import { API_URL } from '../fetcher';

export const fetchWithSparql = (apiUrl: API_URL) => {
  const sparqlQueryDispatcher = (sparqlQuery: string) => {
    const headers = { Accept: 'application/sparql-results+json' };
    const path = `/query/proxy/wdqs/bigdata/namespace/wdq/sparql?query=${encodeURIComponent(
      sparqlQuery
    )}`;

    return fetcher(path, { headers });
  };

  const fetcher = async (path: string, options = {}) => {
    const url = `${apiUrl}/${path}`;
    const res = await fetch(url, options).then((response) => response.json());
    if (res.errors) {
      console.error(res.errors);
      throw new Error('Failed to fetch Wikibase API');
    }
    return res;
  };
  return {
    sparqlQueryDispatcher,
    fetcher,
  };
};
