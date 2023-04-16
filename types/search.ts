import { EntityId } from './entity-id';
import { Namespace } from './namespace';

export interface SearchResult {
  query: QueryResult;
  suggestions: SuggestionsResult;
}

export interface SuggestionsResult {
  responseHeader: ResponseHeader;
  response: SuggestionResponse;
  spellcheck: Spellcheck;
}

export interface ResponseHeader {
  status: number;
  QTime: number;
}

export interface SuggestionResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: any[];
}

export interface Spellcheck {
  suggestions: [string, Suggestions];
  correctlySpelled: boolean;
  collations: any[];
}

export interface Suggestions {
  numFound: number;
  startOffset: number;
  endOffset: number;
  origFreq: number;
  suggestion: Suggestion[];
}

export interface Suggestion {
  word: string;
  freq: number;
}

export interface QueryResult {
  responseHeader: ResponseHeader;
  response: QueryResponse;
}

export interface ResponseHeader {
  status: number;
  QTime: number;
  params?: Params;
}

export interface Params {
  q: string;
  fl: string;
  'q.op': string;
  sort: string;
  rows: string;
  wt: string;
}

export interface QueryResponse {
  numFound: number;
  start: number;
  maxScore: number;
  numFoundExact: boolean;
  docs: Doc[];
}

export type DocSearchKey = Exclude<keyof Doc, 'id'>;

export interface Doc {
  id: EntityId;
  'headline.title': string[];
  'headline-text-search': string[];
  'headline.key': string[];
  'headline.level': string[];
  label: string[];
  'full-text-search': string[];
  title: string[];
  'pageType.label': string[];
  'pageType.assignmentId': string[];
  'pageType.assignmentLabel': string[];
  'pageType.id': string[];
  'pageType.deLabel': string[];
  namespace: Namespace[];
  staNotationLabel?: string[];
  'statements.header.label'?: string[];
  'statements.header.property'?: string[];
  'statements.header.namespace'?: string[];
  'statements.header.string.itemType'?: string[];
  'statements.header.string.values.value'?: string[];
  'statements.table.label'?: string[];
  'statements.table.headline.title'?: string[];
  'statements.table.headline.key'?: string[];
  'statements.table.headline.level'?: string[];
  'statements.table.property'?: string[];
  'statements.table.namespace'?: string[];
  'statements.table.wikibasePointer.id'?: string[];
  'statements.table.wikibasePointer.label'?: string[];
  'statements.table.wikibasePointer.link'?: string[];
  'statements.table.wikibasePointer.namespace'?: string[];
  'statements.table.string.itemType'?: string[];
  'statements.table.string.values.value'?: string[];
  'statements.table.string.values.qualifiers.label'?: string[];
  'statements.table.string.values.qualifiers.headline.title'?: string[];
  'statements.table.string.values.qualifiers.headline.key'?: string[];
  'statements.table.string.values.qualifiers.headline.level'?: string[];
  'statements.table.string.values.qualifiers.property'?: string[];
  'statements.table.string.values.qualifiers.namespace'?: string[];
  'statements.table.string.values.qualifiers.wikibasePointer.id'?: string[];
  'statements.table.string.values.qualifiers.wikibasePointer.label'?: string[];
  'statements.table.string.values.qualifiers.wikibasePointer.link'?: string[];
  'statements.table.string.values.qualifiers.wikibasePointer.namespace'?: string[];
  'statements.body.label': string[];
  'statements.body.headline.title'?: string[];
  'statements.body.headline.key'?: string[];
  'statements.body.headline.level'?: string[];
  'statements.body.property': string[];
  'statements.body.namespace': string[];
  'statements.body.string.itemType': string[];
  'statements.body.string.values.value': string[];
  'statements.body.string.values.headline.title'?: string[];
  'statements.body.string.values.headline.key'?: string[];
  'statements.body.string.values.headline.level'?: string[];
  'statements.body.string.values.qualifiers.label'?: string[];
  'statements.body.string.values.qualifiers.property'?: string[];
  'statements.body.string.values.qualifiers.namespace'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.id'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.label'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.link'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.namespace'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.id'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.pageType.label'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.pageType.assignmentId'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.pageType.assignmentLabel'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.pageType.id'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.pageType.deLabel'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.namespace'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.statements.body.label'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.statements.body.property'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.statements.body.namespace'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.statements.body.string.itemType'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.statements.body.string.values.value'?: string[];
  // _version_: number;
  // score: number;
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.statements.body.string.values.headline.title'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.statements.body.string.values.headline.key'?: string[];
  'statements.body.string.values.qualifiers.wikibasePointer.embedded.statements.body.string.values.headline.level'?: string[];
}
