export interface Field extends Indexable<Field> {
  id: string;
  codings: Codings;
  description: string;
  editLink: string;
  label: string;
  viewLink: string;
  subfields: Subfield[];
}

interface Subfield {
  id: string;
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