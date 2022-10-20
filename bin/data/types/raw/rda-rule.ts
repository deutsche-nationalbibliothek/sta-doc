export interface RdaRuleRaw extends Indexable<RdaRuleRaw> {
  element: Element;
  eId: Element;
  elementLabel: ElementLabel;
}

interface ElementLabel {
  type: string;
  value: string;
  'xml:lang'?: string;
}

interface Element {
  type: string;
  value: string;
}
