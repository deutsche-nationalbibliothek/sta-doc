import { EntityId } from '../entity-id';

export type FieldsRaw = FieldRaw[];

export interface FieldRaw {
  eId: EId;
  repeatable: Repeatable;
  subId: EId;
  subRepeatable: Repeatable;
  subLink: Sublink;
}
interface Repeatable {
  'xml:lang': string;
  type: string;
  value: string;
}
interface EId {
  type: string;
  value: EntityId;
}
interface Sublink {
  type: 'uri';
  value: string;
}
