import { EntityId } from '../entity-id';

export type RdaRulesRaw = RdaRuleRaw[];

export interface RdaRuleRaw {
  element: Element;
  eId: Element;
  elementLabel: ElementLabel;
}

interface ElementLabel {
  type: string;
  value: string;
  'xml:lang'?: string;
}

interface Element {
  type: string;
  value: EntityId;
}
