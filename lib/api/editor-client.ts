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

export type { StaEntryDto, EditorApiError, StaPropertyDto, ValidationResultDto };

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
