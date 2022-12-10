import { EntityId } from '../entity-id';

export type Notations = Record<EntityId, Notation>;

export interface Notation {
  label: string;
  notation: string;
}
