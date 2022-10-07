export interface EntityIndexRaw {
  [key: string]: any;
  eId: Element;
  elementLabel: ElementLabel;
}

interface ElementLabel {
  [key: string]: any;
  value: string;
  'xml:lang'?: string;
}

interface Element {
  [key: string]: any;
  value: string;
}