import fetch from 'node-fetch';
import { API_URL } from '../fetcher';

export const fetchWithSparql = (apiUrl: API_URL) => {
  const sparqlQueryDispatcher = <T>(sparqlQuery: string) => {
    const headers = { Accept: 'application/sparql-results+json' };
    const path = `/query/proxy/wdqs/bigdata/namespace/wdq/sparql?query=${encodeURIComponent(
      sparqlQuery
    )}`;

    return fetcher<{ results: { bindings: T } }>(path, { headers });
  };

  const fetcher = async <T>(path: string, options = {}): Promise<T> => {
    const url = `${apiUrl}/${path}`;
    const response = await fetch(url, options);
    const body = await response.text();
    if (!response.ok) {
      throw new Error(
        `Fetch ${response.status} ${response.statusText} from ${url}${
          body ? ` — ${body.slice(0, 200)}` : ''
        }`
      );
    }
    try {
      return JSON.parse(body) as T;
    } catch {
      throw new Error(
        `Invalid JSON from ${url}${body ? `: ${body.slice(0, 200)}` : ''}`
      );
    }
  };
  return {
    sparqlQueryDispatcher,
    fetcher,
  };
};
