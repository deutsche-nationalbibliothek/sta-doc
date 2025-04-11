import { EntityId } from '../entity-id';

export type PropertyTypesRaw = PropertyTypeRaw[];

export interface PropertyTypeRaw {
  eId: Element;
  typeId: Element;
  typeLabel: ElementLabel;
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
