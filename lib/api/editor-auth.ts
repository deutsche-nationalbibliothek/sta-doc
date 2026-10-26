export type AppRole = 'EDITOR' | 'REDAKTEUR' | 'ADMIN';

export interface AuthUser {
  username: string;
  roles: AppRole[];
}

import { EditorApiError, ValidationResultDto } from './sta-content-types';

/** Browser default: same-origin Next rewrite (sibling to /doc). */
export const API_BASE =
  process.env.NEXT_PUBLIC_EDITOR_API_URL?.replace(/\/$/, '') ||
  '/doc-backend/api';

export function parseErrorBody(body: unknown, status: number): EditorApiError {
  const record =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : undefined;

  let message =
    typeof record?.message === 'string'
      ? record.message
      : typeof body === 'string' && body
        ? body
        : 'Unbekannter Fehler';

  if (message === 'Unbekannter Fehler' && status === 404) {
    message = 'Editor-API nicht gefunden (404)';
  }

  let details =
    typeof record?.details === 'string' && record.details.trim()
      ? record.details
      : undefined;

  if (
    status === 404 &&
    !details &&
    message === 'Editor-API nicht gefunden (404)'
  ) {
    details =
      'POST /sta-content/import-from-wikibase fehlt — bitte sta-doc-api neu deployen (z. B. bin/redeploy.ps1).';
  }

  const validationResult =
    record?.validationResult &&
    typeof record.validationResult === 'object'
      ? (record.validationResult as ValidationResultDto)
      : undefined;

  return {
    message,
    status,
    details,
    validationResult,
    conflict: status === 409,
  };
}

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<{ data?: T; status: number; error?: EditorApiError }> {
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
    return { status: response.status, error: parseErrorBody(body, response.status) };
  }

  return { status: response.status, data: body as T };
}

export async function login(
  username: string,
  password: string
): Promise<{ data?: AuthUser; error?: EditorApiError }> {
  const result = await request<AuthUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return { data: result.data, error: result.error };
}

export async function fetchMe(): Promise<{ data?: AuthUser; error?: EditorApiError }> {
  const result = await request<AuthUser>('/auth/me');
  return { data: result.data, error: result.error };
}

export async function logout(): Promise<void> {
  await request('/auth/logout', { method: 'POST' });
}

export function hasRole(user: AuthUser | null | undefined, role: AppRole): boolean {
  if (!user?.roles?.length) {
    return false;
  }
  if (user.roles.includes(role)) {
    return true;
  }
  if (role === 'EDITOR') {
    return user.roles.includes('REDAKTEUR') || user.roles.includes('ADMIN');
  }
  if (role === 'REDAKTEUR') {
    return user.roles.includes('ADMIN');
  }
  return false;
}

export function getEditorApiBaseUrl(): string {
  return API_BASE;
}
