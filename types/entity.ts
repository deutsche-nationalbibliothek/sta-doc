import { Headline } from './headline';
import { Item } from './item';
import { Property } from './property';

export enum DataSource {
  GND = 'GND',
  RDA = 'RDA',
}

export interface Entities extends Indexable<Entities> {
  [key: string]: Entity;
}
export interface Entity {
  id: string;
  label: string;
  title: string; // only top level
  headline: Headline;
  description?: string;
  logo?: string;
  pageType: PageType;
  statements: Statements;
}

export interface EntityEntry {
  entity: Entity;
  headlines: Headline[];
}

export interface PageType {
  label: string;
  deLabel: string;
  assignmentId: string;
  assignmentLabel: string;
  id: Item;
}

export interface Statements {
  header: Statement[];
  table: Statement[];
  text: Statement[];
}

export interface NoValue {
  noValue: true;
}

export interface UnknownValue {
  unknownValue: true;
}

export interface Statement {
  label: string;
  property: Property;
  string?: StringValueContainer[];
  wikibasePointer?: Maybe<WikiBaseValue>[];
  headline?: Headline;
}

interface CommonValue {
  references?: Reference[];
  embedded: false | Entity;
  qualifiers?: Statement[];
  headline?: Headline;
}

export interface Reference {
  label: string;
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
  itemType?: string | false; // 'default' | ''
  relativeHeadline?: 1 | 2 | 3;
}

export interface StringValue extends CommonValue {
  value: string;
  coding?: Coding;
}

export interface WikiBaseValue extends CommonValue {
  id: string;
  label: string;
  link: string;
  coding?: Coding;
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
