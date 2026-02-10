import { EntityId } from '../entity-id';
import { Codings } from './entity';

export type Fields = Record<EntityId, Field>;
export interface Field {
  id: EntityId;
  staNotationLabel: string;
  codings: Codings;
  labelDe: string;
  labelFr: string;
  repeatable?: string;
  subfields: Subfield[];
}
export type Subfields = Subfield[];
export interface Subfield {
  id: EntityId;
  repeatable?: string;
  staNotationLabel: string;
  codings: Codings;
  labelDe: string;
  labelFr: string;
}