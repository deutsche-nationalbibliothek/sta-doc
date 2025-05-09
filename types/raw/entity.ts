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
  fr: Fr;
}

interface De {
  language: string;
  value: string;
}

interface Fr {
  language: string;
  value: string;
}

interface Aliases {
  de?: De[];
  fr?: Fr[];
}

export interface Claim {
  mainsnak: StatementRaw;
  type: string;
  id: string;
  rank: string;
  qualifiers?: Record<Property, StatementRaw[]>;
  'qualifiers-order'?: string[];
  references?: ReferenceRaw[];
  parentProperty?: Property;
}

export type DatatypeRaw =
  // | 'novalue'
  // | 'somevalue'
  | 'external-id'
  | 'time'
  | 'url'
  | 'wikibase-item'
  | 'wikibase-entityid'
  | 'wikibase-property'
  | 'string';

export interface StatementRaw {
  snaktype: string;
  property: Property;
  hash: string;
  datavalue?: Datavalue;
  datatype: DatatypeRaw;
}

export const isClaim = (
  claimOrStatementRaw: Claim | StatementRaw
): claimOrStatementRaw is Claim => 'mainsnak' in claimOrStatementRaw;

interface Datavalue {
  value: { id: EntityId };
  type: string;
}

export interface ReferenceRaw {
  hash: string;
  snaks: Record<Property, StatementRaw[]>;
  'snaks-order': string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Sitelinks {}
