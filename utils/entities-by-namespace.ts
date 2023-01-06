import entities from '@/data/parsed/entities.json';
import { Item } from '@/types/item';
import { Namespace } from '@/types/namespace';
import { EntityEntry } from '@/types/parsed/entity';
import { namepsaceClassification } from './constants';

export const entitiesByNamespace = (namespace: Namespace) => {
  const namespaceItems: Item[] =
    namepsaceClassification[namespace.toUpperCase()];

  return Object.values(entities as unknown as Record<string, EntityEntry>)
    .filter((entityValue) => {
      return (
        entityValue.entity.pageType &&
        namespaceItems.includes(entityValue.entity.pageType.id)
      );
    })
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
