export type StaPropertyType = 'STRING' | 'ID' | 'TEXT' | 'MULTILINGUAL';

export interface StaPropertyDto {
  key: string;
  label?: string;
  valueTypes?: StaPropertyType[];
}

export interface StaQualifierDto {
  property: StaPropertyDto;
  value: string;
}

export interface StaFullStatementDto {
  id?: string;
  property: StaPropertyDto;
  value: string;
  qualifiers?: StaQualifierDto[];
  embeddedContents?: StaContentDto[];
  action?: 'REMOVE' | 'UPDATE' | 'IGNORE';
}

export interface MultilingualLabelDto {
  value: string;
  language: string;
}

export interface StaContentDto {
  entityId?: string;
  title?: string;
  language?: string;
  staType?: string;
  staNamespace?: string;
  staNotation?: string;
  entityVersion?: number;
  labels?: MultilingualLabelDto[];
  statements?: StaFullStatementDto[];
  [key: string]: unknown;
}

export interface ValidationMessageDto {
  code: string;
  message: string;
}

export interface ValidationResultDto {
  valid?: boolean;
  errors?: ValidationMessageDto[];
  warnings?: ValidationMessageDto[];
}

export interface EditorApiError {
  message: string;
  status: number;
  details?: string;
  validationResult?: ValidationResultDto;
  conflict?: boolean;
}

export function getStatementValueType(property: StaPropertyDto): StaPropertyType {
  const types = property.valueTypes ?? [];
  if (types.includes('ID')) {
    return 'ID';
  }
  if (types.includes('TEXT')) {
    return 'TEXT';
  }
  if (types.includes('STRING')) {
    return 'STRING';
  }
  if (types.includes('MULTILINGUAL')) {
    return 'MULTILINGUAL';
  }
  return 'STRING';
}

export function isDirectlyEditableProperty(property: StaPropertyDto): boolean {
  const type = getStatementValueType(property);
  return type === 'STRING' || type === 'TEXT' || type === 'ID' || type === 'MULTILINGUAL';
}

export function isDirectlyEditableStatement(statement: StaFullStatementDto): boolean {
  return isDirectlyEditableProperty(statement.property);
}

export function isDirectlyEditableQualifier(qualifier: StaQualifierDto): boolean {
  return isDirectlyEditableProperty(qualifier.property);
}

/** Wikibase-style entity / property ids stored as statement or qualifier values. */
export function isEntityIdValue(value: string | undefined | null): boolean {
  return typeof value === 'string' && /^[QP]\d+$/i.test(value.trim());
}

export function cloneStaContent(content: StaContentDto): StaContentDto {
  return JSON.parse(JSON.stringify(content)) as StaContentDto;
}

export function updateStatementValue(
  content: StaContentDto,
  statementIndex: number,
  value: string
): StaContentDto {
  const statements = [...(content.statements ?? [])];
  statements[statementIndex] = { ...statements[statementIndex], value };
  return { ...content, statements };
}

export function updateQualifierValue(
  content: StaContentDto,
  statementIndex: number,
  qualifierIndex: number,
  value: string
): StaContentDto {
  const statements = [...(content.statements ?? [])];
  const statement = statements[statementIndex];
  if (!statement) {
    return content;
  }
  const qualifiers = [...(statement.qualifiers ?? [])];
  if (!qualifiers[qualifierIndex]) {
    return content;
  }
  qualifiers[qualifierIndex] = { ...qualifiers[qualifierIndex], value };
  statements[statementIndex] = { ...statement, qualifiers };
  return { ...content, statements };
}

export function updateLabelValue(
  content: StaContentDto,
  labelIndex: number,
  value: string
): StaContentDto {
  const labels = [...(content.labels ?? [])];
  labels[labelIndex] = { ...labels[labelIndex], value };
  return { ...content, labels };
}
