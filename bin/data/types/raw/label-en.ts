export interface LabelEnRaw {
  [key: string]: any;
  assignmentId?: EId;
  elementLabel: ElementLabel;
  assignmentLabel: ElementLabel;
}

interface ElementLabel {
  [key: string]: any;
  value: string;
  'xml:lang'?: string;
}

interface EId {
  [key: string]: any;
  value: string;
}