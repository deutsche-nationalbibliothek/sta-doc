export type StaNotationsRaw = StaNotationRaw[];

export interface StaNotationRaw {
  eId: EId;
  staNotationLabel: StaNotationLabel;
  notationLabel: EId;
}

interface StaNotationLabel {
  'xml:lang': string;
  type: string;
  value: string;
}

interface EId {
  type: string;
  value: string;
}
