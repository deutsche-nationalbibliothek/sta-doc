import { EntityId } from '../entity-id';

export type PropertiesItemsListRaw = PropertyItemListRaw[];

export interface PropertyItemListRaw {
  element: Element;
  eId: Element;
  assignmentId: Element;
  elementLabel: ElementLabel;
  assignmentLabel: ElementLabel;
}

interface ElementLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

interface Element {
  type: string;
  value: EntityId;
}
