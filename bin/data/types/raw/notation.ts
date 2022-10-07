export interface NotationRaw {
  [key: string]: any;
  elementLabel: ElementLabel;
  notationLabel: EId;
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