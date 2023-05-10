import { EntityId } from '../entity-id';

export type RdaElementStatusesRaw = RdaElementStatusRaw[];

export interface RdaElementStatusRaw {
  eId: EId;
  elementId: ElementId;
  statusId?: StatusId;
  entityLabel: EntityLabel;
  elementLabel: ElementLabel;
  statusLabel: StatusLabel;
  descriptionLabel?: DescriptionLabel;
  embeddedId?: EmbeddedId;
}

export interface EId {
  type: string;
  value: EntityId;
}

export interface ElementId {
  type: string;
  value: EntityId;
}

export interface StatusId {
  type: string;
  value: EntityId;
}

export interface EntityLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

export interface ElementLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

export interface StatusLabel {
  'xml:lang'?: string;
  type: string;
  value: string;
}

export interface DescriptionLabel {
  type: string;
  value: string;
}

export interface EmbeddedId {
  type: string;
  value: string;
}
