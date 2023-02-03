import entities from '@/data/parsed/entities.json';
import { Namespace } from '@/types/namespace';
import { EntityEntry } from '@/types/parsed/entity';

export const entitiesByNamespace = (namespace: Namespace) => {
  return Object.values(entities as unknown as Record<string, EntityEntry>)
    .filter((entityValue) => entityValue.entity.namespace === namespace)
    .map((entityValue) => {
      const { entity } = entityValue;
      const { label, id, pageType } = entity;
      return {
        label,
        id,
        pageTypeLabel: pageType.deLabel,
      };
    });
};
