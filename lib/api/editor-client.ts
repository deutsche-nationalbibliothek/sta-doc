export type { AppRole, AuthUser } from './editor-auth';
export {
  fetchMe,
  getEditorApiBaseUrl,
  hasRole,
  login,
  logout,
} from './editor-auth';

import {
  EditorApiError,
  StaPropertyDto,
  ValidationResultDto,
} from './sta-content-types';
import { StaEntryDto } from './sta-entry-types';
import { API_BASE, parseErrorBody } from './editor-auth';
import type { ReadStageParam } from '@/hooks/fetch-query-params-provider';
import type {
  CatalogEntitiesResponse,
  CreateEntityRequest,
  CreateEntityResponse,
  EntityReferencesResponse,
  MaintenanceReportDto,
} from './catalog-types';

export type { StaEntryDto, EditorApiError, StaPropertyDto, ValidationResultDto };
export type {
  StaCatalogEntryDto,
  CatalogEntitiesResponse,
  CreateEntityRequest,
  CreateEntityResponse,
  EntityReferencesResponse,
  MaintenanceReportDto,
} from './catalog-types';

interface ApiResult<T> {
  data?: T;
  status: number;
  error?: EditorApiError;
}

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
      ...init,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Editor-API nicht erreichbar';
    return {
      status: 0,
      error: { message, status: 0, details: API_BASE },
    };
  }

  if (response.status === 204) {
    return { status: 204 };
  }

  const text = await response.text();
  let body: unknown = undefined;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const parsed = parseErrorBody(body, response.status);
    return { status: response.status, error: parsed };
  }

  return { status: response.status, data: body as T };
}

export async function getStaContent(
  entityId: string,
  options: { language?: string; stage?: ReadStageParam } = {}
): Promise<{ data?: StaEntryDto; error?: EditorApiError }> {
  const language = options.language ?? 'de';
  const stage = options.stage ?? 'working';
  const result = await request<StaEntryDto>(
    `/sta-content/entities/${encodeURIComponent(entityId)}?stage=${encodeURIComponent(stage)}&language=${encodeURIComponent(language)}`
  );
  return { data: result.data, error: result.error };
}

export async function getProperty(
  propertyKey: string,
  options: { language?: string; stage?: ReadStageParam } = {}
): Promise<{ data?: StaPropertyDto; error?: EditorApiError }> {
  const language = options.language ?? 'de';
  const stage = options.stage ?? 'working';
  const result = await request<StaPropertyDto>(
    `/sta-content/properties/${encodeURIComponent(propertyKey)}?stage=${encodeURIComponent(stage)}&language=${encodeURIComponent(language)}`
  );
  return { data: result.data, error: result.error };
}

export async function importStaContentFromWikibase(
  entityId: string,
  options: { wb?: 'edit' | 'live' | 'lab'; language?: string } = {}
): Promise<{ data?: StaEntryDto; error?: EditorApiError }> {
  const wb = options.wb ?? 'edit';
  const language = options.language ?? 'de';
  const result = await request<StaEntryDto>(
    `/sta-content/entities/${encodeURIComponent(entityId)}/import-from-wikibase?wb=${encodeURIComponent(wb)}&language=${encodeURIComponent(language)}`,
    { method: 'POST' }
  );
  return { data: result.data, error: result.error };
}

export interface ImportFromWikibaseResponseDto {
  entry?: StaEntryDto;
  entityId?: string;
  staNotation?: string;
  alreadyPresent?: boolean;
}

export async function importStaContentByIdentifier(
  identifier: string,
  options: { wb?: 'edit' | 'live' | 'lab'; language?: string } = {}
): Promise<{ data?: ImportFromWikibaseResponseDto; error?: EditorApiError }> {
  const wb = options.wb ?? 'edit';
  const language = options.language ?? 'de';
  const result = await request<ImportFromWikibaseResponseDto>(
    '/sta-content/import-from-wikibase',
    {
      method: 'POST',
      body: JSON.stringify({ identifier, wb, language }),
    }
  );
  return { data: result.data, error: result.error };
}

export async function updateStaContent(
  entityId: string,
  content: StaEntryDto
): Promise<{ data?: StaEntryDto; error?: EditorApiError }> {
  const result = await request<StaEntryDto>(
    `/sta-content/entities/${encodeURIComponent(entityId)}?stage=working`,
    {
      method: 'PUT',
      body: JSON.stringify(content),
    }
  );
  return { data: result.data, error: result.error };
}

export async function validateStaContent(
  content: StaEntryDto
): Promise<{ data?: ValidationResultDto; error?: EditorApiError }> {
  const response = await fetch(`${API_BASE}/sta-content/validate`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(content),
  });

  const text = await response.text();
  let body: unknown = undefined;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (response.ok) {
    return { data: body as ValidationResultDto };
  }

  if (
    response.status === 400 &&
    typeof body === 'object' &&
    body !== null &&
    ('errors' in body || 'warnings' in body)
  ) {
    return { data: body as ValidationResultDto };
  }

  return { error: parseErrorBody(body, response.status) };
}

export async function createStaEntity(
  body: CreateEntityRequest
): Promise<{ data?: CreateEntityResponse; error?: EditorApiError }> {
  const result = await request<CreateEntityResponse>('/sta-content/entities?stage=working', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return { data: result.data, error: result.error };
}

export async function deleteStaEntity(
  entityId: string
): Promise<{ error?: EditorApiError }> {
  const result = await request<unknown>(
    `/sta-content/entities/${encodeURIComponent(entityId)}?stage=working`,
    { method: 'DELETE' }
  );
  return { error: result.error };
}

export async function getEntityReferences(
  entityId: string,
  options: { direction?: 'inbound' | 'outbound' | 'both'; language?: string; stage?: ReadStageParam } = {}
): Promise<{ data?: EntityReferencesResponse; error?: EditorApiError }> {
  const direction = options.direction ?? 'both';
  const language = options.language ?? 'de';
  const stage = options.stage ?? 'working';
  const result = await request<EntityReferencesResponse>(
    `/sta-content/entities/${encodeURIComponent(entityId)}/references?stage=${encodeURIComponent(stage)}&direction=${encodeURIComponent(direction)}&language=${encodeURIComponent(language)}`
  );
  return { data: result.data, error: result.error };
}

export async function getCatalogEntities(
  options: {
    namespace?: string;
    staType?: string;
    role?: string;
    language?: string;
    q?: string;
    limit?: number;
    offset?: number;
    stage?: ReadStageParam;
  } = {}
): Promise<{ data?: CatalogEntitiesResponse; error?: EditorApiError }> {
  const params = new URLSearchParams();
  params.set('stage', options.stage ?? 'working');
  params.set('language', options.language ?? 'de');
  if (options.namespace) params.set('namespace', options.namespace);
  if (options.staType) params.set('staType', options.staType);
  if (options.role) params.set('role', options.role);
  if (options.q) params.set('q', options.q);
  if (options.limit != null) params.set('limit', String(options.limit));
  if (options.offset != null) params.set('offset', String(options.offset));
  const result = await request<CatalogEntitiesResponse>(
    `/sta-content/catalog/entities?${params.toString()}`
  );
  return { data: result.data, error: result.error };
}

export async function getMaintenanceReport(
  options: {
    kinds?: string;
    language?: string;
    limitPerKind?: number;
  } = {}
): Promise<{ data?: MaintenanceReportDto; error?: EditorApiError }> {
  const params = new URLSearchParams();
  params.set('stage', 'working');
  params.set('language', options.language ?? 'de');
  if (options.kinds) params.set('kinds', options.kinds);
  if (options.limitPerKind != null) {
    params.set('limitPerKind', String(options.limitPerKind));
  }
  const result = await request<MaintenanceReportDto>(
    `/sta-content/maintenance/report?${params.toString()}`
  );
  return { data: result.data, error: result.error };
}
