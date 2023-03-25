import { EntityId } from '../entity-id';

export type StaNotations = Record<EntityId, StaNotation>;

export interface StaNotation {
  label: string;
  id: EntityId;
}
