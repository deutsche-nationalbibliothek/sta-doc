import entities from '@/data/parsed/entities.json';
import { EntityId } from '@/types/entity-id';
import { Namespace } from '@/types/namespace';
import { EntityEntry } from '@/types/parsed/entity';
import { EntityIndex } from '@/types/parsed/entity-index';

export const entitiesByNamespace = (namespace: Namespace): EntityIndex[] => {
  return Object.values(entities as unknown as Record<EntityId, EntityEntry>)
    .filter((entityValue) => entityValue.entity.namespace === namespace)
    .map((entityValue) => {
      const { entity } = entityValue;
      const { label, id, pageType, staNotationLabel } = entity;
      return {
        label: label as string,
        id,
        pageTypeLabel: pageType?.deLabel,
        staNotationLabel,
      };
    });
};
