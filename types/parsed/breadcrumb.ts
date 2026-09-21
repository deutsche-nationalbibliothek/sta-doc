import { EntityId } from '../entity-id';

export type Breadcrumbs = Record<EntityId, Breadcrumb>;

export interface Breadcrumb {
  id: EntityId;
  labelDe: string;
  labelFr: string;
  staNotation: string;
}