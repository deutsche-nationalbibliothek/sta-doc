export interface CodingRaw extends Indexable<CodingRaw> {
  coding: Coding;
  eId: Coding;
  elementLabel: ElementLabel;
  codingTypeLabel?: ElementLabel;
}

interface ElementLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

interface Coding {
  type: string;
  value: string;
}