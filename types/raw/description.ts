import { EntityId } from '../entity-id';

export type DescriptionRaws = DescriptionRaw[];

export interface DescriptionRaw {
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
