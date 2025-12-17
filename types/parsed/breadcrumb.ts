import { EntityId } from '../entity-id';

export type Breadcrumbs = Record<EntityId, Breadcrumb>;

export interface Breadcrumb {
  id: EntityId;
  label: string;
  staNotation: string;
}