import { EntityId } from '../entity-id';

export type Codings = Record<EntityId, Coding>;

export interface Coding extends CodingData {
  label: string;
}

interface CodingData {
  PICA3: string[];
  'PICA+': string[];
  'Alma'?: string[];
  'Aleph'?: string[];
  'MARC 21'?: string[];
  'GND-Ontologie'?: string[];
}

export type CodingLabel = keyof CodingData;
export type PrefCodingsLabel = 'PICA3' | 'PICA+' | 'Alma' | 'Aleph';
