import { PartialBy } from 'index';
import { EntityId } from '../entity-id';
import { Headline } from '../headline';
import { Item } from '../item';
import { Namespace } from '../namespace';
import { Property } from '../property';
import { Field } from './field';

export type Entities = Record<EntityId, Entity>;
export type EntitiesEntries = Record<EntityId, EntityEntry>;

export interface Entity {
  id: EntityId;
  label?: string;
  title?: string;
  field?: Field;
  headline?: Headline;
  description?: string;
  contextOfUseLabel?: string;
  pageType?: PageType;
  namespace?: Namespace;
  staNotationLabel: string;
  statements: Statements;

  // showOnlyApplicationProfile:
  // if true, then show only ApplicationProfile
  // if false, then never show only ApplicationProfile
  // if undefined, habe both options
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
  label?: string;
  stringGroup?: StringGroup[];
  urls?: UrlValue[];
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
}

export type ItemType = EntityId | 'default' | 'somevalue' | 'novalue';

export interface WikibasePointerValue extends CommonValue {
  id: EntityId;
  label: string;
  link: string;
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
