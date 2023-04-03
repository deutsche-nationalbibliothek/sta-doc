import { EntityId } from '../entity-id';

export type CodingsRaw = CodingRaw[];

export interface CodingRaw {
  coding: Coding;
  eId: EId;
  elementLabel: ElementLabel;
  codingTypeLabel?: ElementLabel;
}

interface ElementLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

interface EId {
  type: string;
  value: EntityId;
}

interface Coding {
  type: string;
  value: string;
}
