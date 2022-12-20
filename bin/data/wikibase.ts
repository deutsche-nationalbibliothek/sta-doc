import { EntityRaw } from '../../types/raw/entity';
import { fetchWithSparql } from './utils/fetch';

export const fetchWikibase = ({
  fetcher,
  sparqlQueryDispatcher,
}: ReturnType<typeof fetchWithSparql>) => {
  const fetchWikiBaseRawData = async (id: string): Promise<EntityRaw> => {
    const res = await fetcher(
      `w/api.php?action=wbgetentities&format=json&languages=de&ids=${id}`
    );
    return res.entities[id];
  };

  const fetchFields = async () =>
    await fetcher('/w/rest.php/gnd/doku/v1/datafields');

  const sparqlQuery = async <T>(sparqlQueryString: string): Promise<T> => {
    const response = await sparqlQueryDispatcher(sparqlQueryString);
    return response.results.bindings;
  };

  const fetchEntity = async (entityId: string, count = 1): Promise<EntityRaw | void> => {
    try {
      if (count <= 3) {
        return await fetchWikiBaseRawData(entityId);
      } else {
        console.error('fetchEntity failed 3 times with', entityId);
      }
    } catch {
      console.warn('fetchEntity caught error on', entityId);
      // todo, count failures to prevent endless loop
      return await fetchEntity(entityId, count + 1);
    }
  };
  return {
    fetchFields,
    sparqlQuery,
    fetchEntity,
  };
};
