import { EntityId } from '../../../types/entity-id';
import { EntityRaw } from '../../../types/raw/entity';
import { FieldsRaw } from '../../../types/raw/field';
import { fetchWithSparql } from '../utils/fetch';

export const fetchWikibase = ({
  fetcher,
  sparqlQueryDispatcher,
}: ReturnType<typeof fetchWithSparql>) => {
  const fetchWikiBaseRawData = async (
    id: string
  ): Promise<Record<EntityId, EntityRaw | void>> => {
    const res = await fetcher(
      `w/api.php?action=wbgetentities&format=json&languages=de&ids=${id}`
    );
    return res.entities;
  };

  const fetchFields = async (): Promise<{ fields: FieldsRaw }> =>
    await fetcher('/w/rest.php/gnd/doku/v1/datafields');

  const sparqlQuery = async <T>(sparqlQueryString: string): Promise<T> => {
    const response = await sparqlQueryDispatcher(sparqlQueryString);
    return response.results.bindings;
  };

  const fetchEntity = async (
    entityId: EntityId | string,
    count = 1
  ): Promise<Record<EntityId, EntityRaw | void>> => {
    try {
      if (count <= 3) {
        return await fetchWikiBaseRawData(entityId);
      } else {
        console.error('fetchEntity failed 3 times with', entityId);
        return Promise.reject();
      }
    } catch {
      console.warn('fetchEntity caught error on', entityId);
      return await fetchEntity(entityId, count + 1);
    }
  };

  return {
    fetchFields,
    sparqlQuery,
    fetchEntity,
  };
};
