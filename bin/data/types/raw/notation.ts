export interface NotationRaw extends Indexable<NotationRaw> {
  eId: EId;
  elementLabel: ElementLabel;
  notationLabel: EId;
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
