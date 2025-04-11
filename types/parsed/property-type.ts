import { EntityId } from '../entity-id';

export type PropertyTypes = Record<EntityId, PropertyType>;

export interface PropertyType {
  id: string;
  label: string;
}