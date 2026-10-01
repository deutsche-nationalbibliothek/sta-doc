export type WikibaseResponse = {
  [key: string]: {
    claims: Record<string, Statement[]>;
  };
};

type Statement = {
  mainsnak: Snak;
  type: string;
  id: string;
  rank: string;
  qualifiers?: Record<string, Snak[]>;
};

type Snak = {
  snaktype: string;
  property: string;
  hash: string;
  datavalue?: {
    value: string | EntityValue;
    type: string;
  };
  datatype: string;
};

type EntityValue = {
    'entity-type': string;
    'numeric-id': number;
    id: string;
  };
  


  
