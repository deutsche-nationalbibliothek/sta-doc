export interface RdaPropertyRaw {
  [key: string]: any;
  eId: Element;
  assignmentId: Element;
  elementLabel: ElementLabel;
  assignmentLabel: ElementLabel;
}

interface ElementLabel {
  [key: string]: any;
  type: string;
  value: string;
}

interface Element {
  [key: string]: any;
  value: string;
}