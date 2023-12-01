import fetch from 'node-fetch';
import { API_URL } from '../fetcher';

export const fetchWithSparql = (apiUrl: API_URL) => {
  console.log('apiUrl', apiUrl);
  const sparqlQueryDispatcher = <T>(sparqlQuery: string) => {
    const headers = { Accept: 'application/sparql-results+json' };
    const path = `/query/proxy/wdqs/bigdata/namespace/wdq/sparql?query=${encodeURIComponent(
      sparqlQuery
    )}`;

    return fetcher<{ results: { bindings: T } }>(path, { headers });
  };

  const fetcher = async <T>(path: string, options = {}): Promise<T> => {
    const url = `${apiUrl}/${path}`;
    return await fetch(url, options).then((response) => response.json() as T);
  };
  return {
    sparqlQueryDispatcher,
    fetcher,
  };
};
