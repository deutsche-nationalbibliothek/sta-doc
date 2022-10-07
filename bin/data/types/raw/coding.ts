export interface CodingRaw {
  [key: string]: any;
  eId: Coding;
  elementLabel: ElementLabel;
  codingTypeLabel?: ElementLabel;
}

interface ElementLabel {
  [key: string]: any;
  type: string;
  value: string;
}

interface Coding {
  [key: string]: any;
  value: string;
}