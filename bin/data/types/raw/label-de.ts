export interface LabelDeRaw extends Indexable<LabelDeRaw> {
  eId: EId;
  elementLabel: ElementLabel;
}

interface ElementLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

interface EId {
  type: string;
  value: string;
}