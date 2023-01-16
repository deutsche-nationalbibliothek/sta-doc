import { EntityId } from '../entity-id';
import { Property } from '../property';

export type EntitiesRaw = Record<EntityId, EntityRaw>;

export interface EntityRaw {
  pageid: number;
  ns: number;
  title: string;
  lastrevid: number;
  modified: string;
  type: string;
  datatype?: string;
  id: EntityId;
  labels: Labels;
  descriptions: Partial<Labels>;
  aliases: Aliases;
  claims: Record<EntityId, Claim[]>;
  sitelinks?: Sitelinks;
}

interface Labels {
  de: De;
}

interface De {
  language: string;
  value: string;
}

interface Aliases {
  de?: De[];
}

export interface Claim {
  mainsnak: StatementRaw;
  type: string;
  id: string;
  rank: string;
  qualifiers?: Record<Property, StatementRaw[]>;
  'qualifiers-order'?: string[];
  references?: Reference[];
}

export interface StatementRaw {
  snaktype: string;
  property: Property;
  hash: string;
  datavalue?: Datavalue;
  datatype: string;
}

interface Datavalue {
  value: any;
  type: string;
}

export interface Reference {
  hash: string;
  snaks: StatementRaw[][];
  'snaks-order': string[];
}

interface Sitelinks { }
