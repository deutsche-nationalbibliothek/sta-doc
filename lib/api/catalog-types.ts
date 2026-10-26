import { Namespace } from '@/types/namespace';

export interface StaCatalogEntryDto {
  entityId: string;
  title: string;
  staNotation?: string | null;
  staType?: string | null;
  namespace?: string | null;
  role?: string | null;
  inboundRefCount?: number;
  pageTypeLabel?: string | null;
}

export interface CatalogEntitiesResponse {
  items: StaCatalogEntryDto[];
  limit: number;
  offset: number;
}

export interface StaEntryReferenceDto {
  sourceEntityId: string;
  targetEntityId: string;
  sourceTitle?: string;
  targetTitle?: string;
  language?: string;
}

export interface EntityReferencesResponse {
  entityId: string;
  direction: string;
  references: StaEntryReferenceDto[];
}

export interface MaintenanceReportDto {
  summary: Record<string, number>;
  items: Record<string, StaCatalogEntryDto[]>;
}

export interface CreateEntityRequest {
  staType: string;
  title: string;
  language: string;
  staNamespace?: string;
  staNotation?: string;
  role?: 'page' | 'fragment';
  sourceInfo?: string;
}

export interface CreateEntityResponse {
  success: boolean;
  message: string;
  entityId: string;
  staNotation?: string;
  role?: string;
}

/** Namespaces offered when creating a page (matches GND-I / RDA-I / STA-I). */
export const NEW_PAGE_NAMESPACE_OPTIONS = [
  { value: Namespace.GND, labelDe: 'GND', labelFr: 'GND' },
  { value: Namespace.RDA, labelDe: 'RDA', labelFr: 'RDA' },
  { value: Namespace.STA, labelDe: 'STA', labelFr: 'STA' },
] as const;

const newPageNamespaceSet = new Set<string>(
  NEW_PAGE_NAMESPACE_OPTIONS.map((o) => o.value)
);

export function resolveNewPageNamespace(
  preferred?: Namespace | string
): Namespace {
  if (preferred && newPageNamespaceSet.has(preferred)) {
    return preferred as Namespace;
  }
  return Namespace.GND;
}

/** Known STA page types for the new-page dialog (Sprint 2). */
export const STA_PAGE_TYPE_OPTIONS = [
  { value: 'Q3095', labelDe: 'Regeltext', labelFr: 'Texte de règle' },
  { value: 'Q14', labelDe: 'GND-Beispiel', labelFr: 'Exemple GND' },
  { value: 'Q8470', labelDe: 'RDA-Beispiel', labelFr: 'Exemple RDA' },
  { value: 'Q10609', labelDe: 'GND-Implementierung', labelFr: 'Implémentation GND' },
] as const;
