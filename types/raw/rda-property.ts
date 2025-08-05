import { EntityId } from '../entity-id';

export type RdaPropertiesRaw = RdaPropertyRaw[];

interface EntityType {
  entitytypeId: Element;
  entitytypeLabel: ElementLabel;
  entitytypeLabelFr: ElementLabel;
}

interface WemiType {
  wemilevelId: Element;
  wemilevelLabel: ElementLabel;
  wemilevelLabelFr: ElementLabel;
}

export interface RdaPropertyRaw extends Partial<EntityType>, Partial<WemiType> {
  element: Element;
  eId: Element;
  elementLabel: ElementLabel;
  elementLabelFr: ElementLabel;
}

interface ElementLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

interface Element {
  type: string;
  value: EntityId;
}
