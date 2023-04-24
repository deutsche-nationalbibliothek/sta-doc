import { EntityId } from '../entity-id';

export type EntitiesIndex = Record<EntityId, EntityIndex>;

export interface EntityIndex {
  label: string;
  id: EntityId;
  pageTypeLabel?: string;
  staNotationLabel: string;
}
