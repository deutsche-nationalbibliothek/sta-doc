import { EntityId } from '../entity-id';

export type Fields = Field[];

interface CommonField {
  id: EntityId;
  codings: Codings;
  description: string;
  editLink: string;
  label: string;
  viewLink: string;
  repeatable: boolean;
  staNotationLabel: string;
}

export interface Field extends CommonField {
  subfields: CommonField[];
}

export type Subfield = CommonField;

interface Codings {
  'PICA+': string;
  PICA3: string;
  'MARC 21'?: string;
}
