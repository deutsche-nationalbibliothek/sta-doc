import { Property } from './property';

export interface Entities {
  [key: string]: Entity;
}
export interface Entity {
  id: string;
  label: string;
  title: string; // only top level
  description?: string;
  logo?: string;
  pageType: PageType;
  statements: Statements;
}

export interface PageType {
  label: string;
  assignmentId: string;
  assignmentLabel: string;
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
  'wikibase-item'?: (WikiBaseValue | UnknownValue | NoValue)[];
  'wikibase-property'?: (WikiBaseValue | UnknownValue | NoValue)[];
  'wikibase-entityid'?: (WikiBaseValue | UnknownValue | NoValue)[];
}

interface CommonValue {
  references?: Reference[];
  embedded: false | Entity;
  qualifiers?: Statement[];
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
  values: (StringValue | UnknownValue | NoValue)[];
  itemType?: string | false; // 'default' | ''
  relativeHeadline?: 1 | 2 | 3;
}

export interface StringValue extends CommonValue {
  value: string;
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
