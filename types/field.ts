export interface Field {
  id: string;
  label: string;
  description: string;
  aliases: string[];
  definition: string;
  repeatable: boolean;
  subfields: Subfield[];
  codings: Codings;
  validation: string[];
  rulesOfUse: string[];
  examples: Example[];
  viewLink: string;
  editLink: string;
}

interface Example {
  id: string;
  label: string;
  viewLink: string;
  editLink: string;
}

interface Subfield {
  id: string;
  label: string;
  description: string;
  codings: Codings;
  allowedValues: undefined;
  references: Reference[][];
  repeatable: boolean;
  viewLink: string;
  editLink: string;
}

interface Reference {
  description: string;
  URL?: string;
}

interface Codings {
  'PICA+': string;
  PICA3: string;
  'MARC 21'?: string;
}
