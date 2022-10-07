export interface LabelDeRaw {
  [key: string]: any;
  elementLabel: ElementLabel;
}

interface ElementLabel {
  [key: string]: any;
  type: string;
  value: string;
}

interface EId {
  [key: string]: any;
  value: string;
}