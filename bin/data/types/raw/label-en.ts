export interface LabelEnRaw extends Indexable<LabelEnRaw> {
  eId: EId;
  assignmentId?: EId;
  elementLabel: ElementLabel;
  assignmentLabel: ElementLabel;
}

interface ElementLabel {
  type: string;
  value: string;
  'xml:lang'?: string;
}

interface EId {
  type: string;
  value: string;
}