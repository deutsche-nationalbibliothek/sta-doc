import { Item } from '../item';
import { Property } from '../property';

export type FieldsRaw = Record<Property, FieldRaw>;

interface FieldRaw {
  label: string;
  description: string;
  aliases: string[];
  definition: string;
  repeatable: boolean;
  subfields: Subfields;
  codings: Codings;
  allowedValues?: Record<Item, string>;
  validation: string[];
  rulesOfUse: string[];
  examples: any[];
  viewLink: string;
  editLink: string;
}

type Subfields = Record<Property, Subfield>;
interface Subfield {
  label: string;
  description: string;
  codings: Codings;
  allowedValues: any[];
  references: any[];
  repeatable: boolean;
  viewLink: string;
  editLink: string;
}

// Examples are either this type (if any), or en empty array
// type Examples = Record<Item, Example> | []
// interface Example {
//   label: string;
//   viewLink: string;
//   editLink: string;
// }

interface Codings {
  'PICA+': string;
  PICA3: string;
  'MARC 21': string;
  'Alma': string;
  'Aleph': string;
}
