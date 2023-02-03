export type SchemasRaw = SchemaRaw[];

export interface SchemaRaw {
  eId: EId;
  schemaLabel: SchemaLabel;
  schemaId: EId;
}

interface SchemaLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

interface EId {
  type: string;
  value: string;
}
