import { EntityId } from '../entity-id';

export type LabelFrRaws = LabelFrRaw[];

export interface LabelFrRaw {
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
