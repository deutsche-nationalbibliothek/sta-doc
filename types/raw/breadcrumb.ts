import { EntityId } from '../entity-id';

export type BreadcrumbsRaw = BreadcrumbRaw[];

export interface BreadcrumbRaw {
  eId: EId;
  elementLabel: ElementLabel;
  staNotation: StaNotationLabel;
}

interface StaNotationLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

interface ElementLabel {
  type: string;
  value: string;
  'xml:lang'?: string;
}

interface EId {
  type: string;
  value: EntityId;
}
