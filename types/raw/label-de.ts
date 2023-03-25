import { EntityId } from '../entity-id';

export type LabelDeRaws = LabelDeRaw[];

export interface LabelDeRaw {
  eId: EId;
  elementLabel: ElementLabel;
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
