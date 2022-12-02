export interface Field {
  id: string;
  codings: Codings;
  description: string;
  editLink: string;
  label: string;
  viewLink: string;
  subfields: Subfield[];
}

export interface Subfield {
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
