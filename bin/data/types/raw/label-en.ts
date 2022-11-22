export interface LabelEnRaw extends Indexable<LabelEnRaw> {
  eId: EId;
  assignmentId: EId;
  elementLabel: ElementLabel;
  assignmentLabel: AssignmentLabel;
}

interface AssignmentLabel {
  'xml:lang': string;
  type: string;
  value: string;
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