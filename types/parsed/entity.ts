import { EntityId } from '../entity-id';
import { Headline } from '../headline';
import { Item } from '../item';
import { Namespace } from '../namespace';
import { Property } from '../property';
import { Field } from './field';

export type Entities = Record<EntityId, Entity>;
export type EntitiesEntries = Record<EntityId, EntityEntry>;

export interface Entity {
  id: string;
  label?: string;
  title?: string; // only top level
  field?: Field;
  headline?: Headline;
  description?: string;
  // logo?: string;
  pageType?: PageType;
  namespace: Namespace;
  staNotationLabel?: string;
  statements: Statements;
}

export interface EntityEntry {
  entity: Entity;
  headlines: Headline[];
}

export type EntityEntryWithOptionalHeadlines = PartialBy<
  EntityEntry,
  'headlines'
>;

export interface PageType {
  label?: string;
  deLabel: string;
  assignmentId: string;
  assignmentLabel: string;
  id: Item; //Item;
}

export interface Statements {
  header: Statement[];
  table: Statement[];
  text: Statement[];
}

export interface NoValue extends CommonValue {
  noValue: true;
}

export interface UnknownValue extends CommonValue {
  unknownValue: true;
}

export interface Statement {
  label?: string;
  property?: Property;
  string?: StringValueContainer[];
  wikibasePointer?: Maybe<WikiBaseValue>[];
  headline?: Headline;
  namespace: Namespace;
  url?: UrlValue[];
  coding?: Coding;
}

export interface CommonValue {
  references?: Reference[];
  property: Property;
  embedded?: Entity;
  qualifiers?: Statement[];
  // headline?: Headline;
}

export type StatementValue = Statement & CommonValue;

export interface Reference {
  label?: string;
  string?: StringValueContainer[];
  url?: UrlValue[];
}

export interface TimeValue extends CommonValue {
  value: string;
}

export interface UrlValue extends CommonValue {
  value: string;
}

export interface StringValueContainer {
  values: Maybe<StringValue>[];
  itemType: EntityId | 'default'; // 'default' | ''
  relativeHeadline?: 1 | 2 | 3;
}

export interface StringValue extends CommonValue {
  value: string;
  coding?: Coding;
  headline?: Headline;
  itemType: EntityId | 'default';
}

export interface WikiBaseValue extends CommonValue {
  id: EntityId;
  label: string;
  link: string;
  coding?: Coding;
  headline?: Headline;
  staNotationLabel?: string;
  namespace: Namespace;
}

// export type StatementValue = TimeValue | UrlValue | StringValue | WikiBaseValue

export interface StatementsByGroup {
  header: StatementValue[];
  table: StatementValue[];
  text: StatementValue[];
}

export interface Coding {
  label: string;
  PICA3: string[];
  'PICA+': string[];
  'MARC 21 Format für Normdaten'?: string[];
  'GND-Ontologie'?: string[];
}

export type Maybe<T> = T | UnknownValue | NoValue;

export const isWikibaseValue = (
  wikibaseValue: Maybe<WikiBaseValue>
): wikibaseValue is WikiBaseValue => wikibaseValue && 'label' in wikibaseValue;

export const isStringValue = (
  stringValue: Maybe<StringValue>
): stringValue is StringValue => stringValue && 'value' in stringValue;
