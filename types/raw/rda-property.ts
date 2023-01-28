export type RdaPropertiesRaw = RdaPropertyRaw[];

type EntityTypeOrWemi =
  | {
    entitytypeId: Element;
    entitytypeLabel: ElementLabel;
  }
  | {
    wemilevelId: Element;
    wemilevelLabel: ElementLabel;
  };

export type RdaPropertyRaw = EntityTypeOrWemi & {
  element: Element;
  eId: Element;
  elementLabel: ElementLabel;
};

interface ElementLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

interface Element {
  type: string;
  value: string;
}
