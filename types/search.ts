import { EntityId } from './entity-id';

export interface SearchResult {
  responseHeader: ResponseHeader;
  response: Response;
}

export interface ResponseHeader {
  status: number;
  QTime: number;
  params: Params;
}

export interface Params {
  q: string;
  fl: string;
  'q.op': string;
  sort: string;
  rows: string;
  wt: string;
}

export interface Response {
  numFound: number;
  start: number;
  maxScore: number;
  numFoundExact: boolean;
  docs: Doc[];
}

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
  namespace: string[];
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
  'statements.text.label': string[];
  'statements.text.headline.title'?: string[];
  'statements.text.headline.key'?: string[];
  'statements.text.headline.level'?: string[];
  'statements.text.property': string[];
  'statements.text.namespace': string[];
  'statements.text.string.itemType': string[];
  'statements.text.string.values.value': string[];
  'statements.text.string.values.headline.title'?: string[];
  'statements.text.string.values.headline.key'?: string[];
  'statements.text.string.values.headline.level'?: string[];
  'statements.text.string.values.qualifiers.label'?: string[];
  'statements.text.string.values.qualifiers.property'?: string[];
  'statements.text.string.values.qualifiers.namespace'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.id'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.label'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.link'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.namespace'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.id'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.pageType.label'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.pageType.assignmentId'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.pageType.assignmentLabel'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.pageType.id'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.pageType.deLabel'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.namespace'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.statements.text.label'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.statements.text.property'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.statements.text.namespace'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.statements.text.string.itemType'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.statements.text.string.values.value'?: string[];
  _version_: number;
  score: number;
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.statements.text.string.values.headline.title'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.statements.text.string.values.headline.key'?: string[];
  'statements.text.string.values.qualifiers.wikibasePointer.embedded.statements.text.string.values.headline.level'?: string[];
}