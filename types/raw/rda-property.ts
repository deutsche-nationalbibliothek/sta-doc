export type RdaPropertiesRaw = RdaPropertyRaw[];

export interface RdaPropertyRaw {
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
  value: string;
}
