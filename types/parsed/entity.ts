import { PartialBy } from 'index';
import { EntityId } from '../entity-id';
import { Headline } from '../headline';
import { Item } from '../item';
import { Namespace } from '../namespace';
import { Property } from '../property';
import { Field } from './field';
import { RdaElementStatus } from './rda-element-status';

export type Entities = Record<EntityId, Entity>;
export type EntitiesEntries = Record<EntityId, EntityEntry>;

export interface Entity {
  id: EntityId;
  label?: string;
  elementOf?: string;
  annotation?: WikibasePointerValue;
  field?: Field;
  headline?: Headline;
  description?: string;
  contextOfUseLabel?: string;
  pageType?: PageType;
  namespace?: Namespace;
  staNotationLabel: string;
  statements: Statements;
  rdaElementStatuses?: RdaElementStatus[];

  // showOnlyApplicationProfile:
  // if true, then show only ApplicationProfile
  // if false, then never show only ApplicationProfile
  // if undefined, have both options with Switch
  showOnlyApplicationProfile?: boolean;
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
  schema: string;
  assignmentId: string;
  assignmentLabel: string;
  id: Item; //Item;
}

export interface Statements {
  header: StatementValue[];
  table: StatementValue[];
  body: StatementValue[];
}

export interface Statement extends Datatypes {
  label?: string;
  link?: EntityId;
  property: Property;
  headline?: Headline;
  namespace?: Namespace;
  codings?: Codings;
  staNotationLabel?: string;
}

export type StatementValue = Statement & CommonValue;

export interface CommonValue {
  references?: Reference[];
  property: Property;
  embedded?: Entity;
  missingValue?: 'somevalue' | 'novalue';
  qualifiers?: Statement[];
  // headline?: Headline;
}

// always only one key present
export interface Datatypes {
  urls?: UrlValue[];
  stringGroups?: StringGroup[];
  times?: TimeValue[];
  wikibasePointers?: WikibasePointerValue[];
  // noValues?: NoValue[];
  // someValues?: UnknownValue[];
}

export interface UnknownValue {
  unknownValue: true;
}

export interface NoValue {
  noValue: true;
}

export interface Reference {
  // data should have eithter Property.URL or Property.URI
  [Property.URL]: string;
  [Property.URI]: string;
  [Property.description]: string;
  // with Property['description-(at-the-end)']:
  //  typescript: A computed property name in an interface must refer to
  //  an expression whose type is a literal type or a 'unique symbol' type.
  ['P642']: string;
}

export interface TimeValue extends CommonValue {
  value: string;
}

export interface UrlValue extends CommonValue {
  value: string;
}

export interface StringGroup {
  values: StringValue[];
  itemType: ItemType; // 'default' | ''
  relativeHeadline?: 1 | 2 | 3;
}

export interface StringValue extends CommonValue {
  value: string;
  codings?: Codings;
  headline?: Headline;
  itemType?: ItemType;
  link?: EntityId;
}

export type ItemType = EntityId | 'default' | 'somevalue' | 'novalue';

export interface WikibasePointerValue extends CommonValue {
  id: EntityId;
  label: string;
  codings?: Codings;
  headline?: Headline;
  staNotationLabel?: string;
  namespace?: Namespace;
}

export interface Codings {
  label: string;
  PICA3: string[];
  'PICA+': string[];
  'MARC 21 Format für Normdaten'?: string[];
  'GND-Ontologie'?: string[];
}