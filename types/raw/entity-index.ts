export type EntitiesIndexRaw = EntityIndexRaw[];

export interface EntityIndexRaw {
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
  value: string;
}
