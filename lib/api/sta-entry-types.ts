import { MultilingualLabelDto } from './sta-content-types';

export type StaEntryRole = 'page' | 'fragment';

/** Import debt: unmapped Wikibase qualifier — read-only, not editable model. */
export interface UnresolvedClaimDto {
  propertyKey: string;
  label?: string;
  value?: string;
  source?: 'qualifier' | string;
}

export type StaValue =
  | { kind: 'string'; id?: string; value?: string; unresolved?: UnresolvedClaimDto[] }
  | { kind: 'id'; id?: string; entityId?: string; unresolved?: UnresolvedClaimDto[] }
  | {
      kind: 'document';
      id?: string;
      html?: string;
      unresolved?: UnresolvedClaimDto[];
    };

export interface StaSectionDto {
  propertyKey?: string;
  values?: StaValue[];
}

export interface StaEntryDto {
  formatVersion?: number;
  entityId?: string;
  title?: string;
  role?: StaEntryRole;
  staType?: string;
  staNotation?: string;
  staNamespace?: string;
  language?: string;
  defaultLanguage?: string;
  sourceInfo?: string;
  entityVersion?: number;
  editionVersion?: number;
  basedOnDefaultVersion?: number;
  labels?: MultilingualLabelDto[];
  editions?: StaEditionSummaryDto[];
  sections?: StaSectionDto[];
}

export interface StaEditionSummaryDto {
  language: string;
  version: number;
  basedOnDefaultVersion?: number;
}

export const DEFAULT_ENTRY_LANGUAGE = 'de';

export function languageCodes(entry: StaEntryDto, active?: string): string[] {
  const codes = new Set<string>([
    entry.defaultLanguage || DEFAULT_ENTRY_LANGUAGE,
  ]);
  for (const edition of entry.editions ?? []) {
    codes.add(edition.language);
  }
  if (active) {
    codes.add(active);
  }
  return [...codes];
}

export function primaryDocumentPropertyKey(entry: StaEntryDto): string {
  return primaryDocumentSection(entry)?.propertyKey || 'P1';
}

/** First document value on the entry, if any. */
export function primaryDocumentSection(
  entry: StaEntryDto | null | undefined
): { propertyKey: string; value: Extract<StaValue, { kind: 'document' }> } | undefined {
  if (!entry) {
    return undefined;
  }
  for (const section of entry.sections ?? []) {
    for (const value of section.values ?? []) {
      if (value.kind === 'document') {
        return {
          propertyKey: section.propertyKey || 'P1',
          value,
        };
      }
    }
  }
  return undefined;
}

export function documentHtmlOf(entry: StaEntryDto, language: string): string {
  if (entry.language !== language) {
    return '';
  }
  return primaryDocumentSection(entry)?.value.html ?? '';
}

/** All import-debt claims on this edition, with section property for display. */
export function unresolvedClaims(
  entry: StaEntryDto
): { propertyKey: string; claim: UnresolvedClaimDto }[] {
  const items: { propertyKey: string; claim: UnresolvedClaimDto }[] = [];
  for (const section of entry.sections ?? []) {
    const sectionKey = section.propertyKey || '?';
    for (const value of section.values ?? []) {
      for (const claim of value.unresolved ?? []) {
        if (claim?.propertyKey) {
          items.push({ propertyKey: sectionKey, claim });
        }
      }
    }
  }
  return items;
}

export function withDocumentHtml(
  entry: StaEntryDto,
  language: string,
  html: string,
  propertyKey = primaryDocumentPropertyKey(entry)
): StaEntryDto {
  const sections = [...(entry.sections ?? [])];
  const index = sections.findIndex((section) => section.propertyKey === propertyKey);
  const documentValue: StaValue = { kind: 'document', html };
  if (index < 0) {
    sections.push({ propertyKey, values: [documentValue] });
  } else {
    const section = sections[index];
    const values = [...(section.values ?? [])];
    const docIndex = values.findIndex((value) => value.kind === 'document');
    if (docIndex >= 0) {
      const existing = values[docIndex];
      values[docIndex] = {
        kind: 'document',
        id: existing.kind === 'document' ? existing.id : undefined,
        unresolved: existing.kind === 'document' ? existing.unresolved : undefined,
        html,
      };
    } else {
      values.unshift(documentValue);
    }
    sections[index] = { ...section, values };
  }
  return {
    ...entry,
    language,
    defaultLanguage: entry.defaultLanguage || DEFAULT_ENTRY_LANGUAGE,
    sections,
  };
}

/** Replace one value in a section by index. */
export function replaceSectionValue(
  entry: StaEntryDto,
  language: string,
  propertyKey: string,
  valueIndex: number,
  next: StaValue
): StaEntryDto {
  const sections = [...(entry.sections ?? [])];
  const index = sections.findIndex((section) => section.propertyKey === propertyKey);
  if (index < 0) {
    return entry;
  }
  const section = sections[index];
  const values = [...(section.values ?? [])];
  if (valueIndex < 0 || valueIndex >= values.length) {
    return entry;
  }
  values[valueIndex] = next;
  sections[index] = { ...section, values };
  return {
    ...entry,
    language,
    defaultLanguage: entry.defaultLanguage || DEFAULT_ENTRY_LANGUAGE,
    sections,
  };
}

export function cloneStaEntry(entry: StaEntryDto): StaEntryDto {
  return JSON.parse(JSON.stringify(entry)) as StaEntryDto;
}

export function updateLabelValue(
  entry: StaEntryDto,
  labelIndex: number,
  value: string
): StaEntryDto {
  const labels = [...(entry.labels ?? [])];
  labels[labelIndex] = { ...labels[labelIndex], value };
  return { ...entry, labels };
}
