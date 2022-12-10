import { EntityId } from '../entity-id';

export type Codings = Record<EntityId, Coding>;

export interface Coding extends CodingData {
  label: string;
}

interface CodingData {
  PICA3: any[];
  'PICA+': any[];
  'MARC 21': any[];
  'GND-Ontologie': string[];
}

export type CodingLabel = keyof CodingData
