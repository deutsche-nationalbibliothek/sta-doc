export type ParsedStatementGroup = {
  propertyId: string;
  statements: ParsedStatement[];
}

export type ParsedStatement = {
    key: string;
    propertyId: string;
    snaktype: string;
    value: string | undefined;
    datatype: string;
    type: string;
    statementId: string;
    qualifiers: Qualifier[];
  };

export type Qualifier = {
    id: string;
    propertyId: string;
    snaktype: string;
    value: string;
    datatype: string;
  };
  
  