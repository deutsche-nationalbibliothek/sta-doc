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
  ): Promise<Record<EntityId, EntityRaw>> => {
    const res = await fetcher<{ entities?: Record<EntityId, EntityRaw> }>(
      `w/api.php?action=wbgetentities&format=json&languages=de&ids=${id}`
    );
    if (!res?.entities) {
      throw new Error(`wbgetentities returned no entities for ${id}`);
    }
    return res.entities;
  };

  const sparqlQuery = async <T>(sparqlQueryString: string): Promise<T> => {
    const response = await sparqlQueryDispatcher<T>(sparqlQueryString);
    return response.results.bindings;
  };

  const fetchEntity = async (
    entityId: EntityId | string,
    count = 1
  ): Promise<Record<EntityId, EntityRaw>> => {
    try {
      return await fetchWikiBaseRawData(entityId);
    } catch (error) {
      if (count >= 3) {
        console.error('fetchEntity failed 3 times with', entityId, error);
        throw error instanceof Error
          ? error
          : new Error(`fetchEntity failed 3 times with ${entityId}`);
      }
      console.warn('fetchEntity caught error on', entityId, error);
      return await fetchEntity(entityId, count + 1);
    }
  };

  return {
    sparqlQuery,
    fetchEntity,
  };
};
