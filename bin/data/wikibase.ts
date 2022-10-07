import { RawEntity } from './types/raw-entity';
import { fetcher, sparqlQueryDispatcher } from './utils';

const fetchWikiBaseRawData = async (id: string): Promise<RawEntity> => {
  const res = await fetcher(
    `w/api.php?action=wbgetentities&format=json&languages=de&ids=${id}`
  );
  return res.entities[id];
};

export const fetchFields = async () =>
  await fetcher('/w/rest.php/gnd/doku/v1/datafields');

export const sparqlQuery = async (sparqlQueryString: string) => {
  const response = await sparqlQueryDispatcher(sparqlQueryString);
  return response.results.bindings;
};

export const fetchEntity = async (entryId: string): Promise<RawEntity> => {
  try {
    return await fetchWikiBaseRawData(entryId);
  } catch {
    console.log('fetchEntity caught error on', entryId);
    // todo, count failures to prevent endless loop
    return await fetchEntity(entryId);
  }
};
