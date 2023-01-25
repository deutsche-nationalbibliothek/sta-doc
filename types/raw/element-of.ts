export type ElementsOfRaw = ElementOfRaw[];

export interface ElementOfRaw {
  eId: EId;
  elementOfLabel: ElementOfLabel;
  elementOfId: EId;
}

interface ElementOfLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

interface EId {
  type: string;
  value: string;
}
