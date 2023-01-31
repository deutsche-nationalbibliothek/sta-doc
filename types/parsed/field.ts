import { EntityId } from '../entity-id';

export type Fields = Field[];

export interface Field {
  id: EntityId;
  codings: Codings;
  description: string;
  editLink: string;
  label: string;
  viewLink: string;
  subfields: Subfield[];
}

export interface Subfield {
  id: EntityId;
  codings: Codings;
  description: string;
  editLink: string;
  label: string;
  viewLink: string;
}

interface Codings {
  'PICA+': string;
  PICA3: string;
  'MARC 21'?: string;
}
