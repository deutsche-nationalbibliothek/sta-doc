import type { NextApiRequest, NextApiResponse } from 'next';
import type { StaEntryDto } from '@/lib/api/sta-entry-types';
import {
  editorApiBaseUrl,
  parseImportIdentifier,
  resolveStaNotationToEntityId,
} from '@/lib/bff/editor-api-base';

interface ImportResponseBody {
  entry?: StaEntryDto;
  entityId?: string;
  staNotation?: string;
  alreadyPresent?: boolean;
}

async function readJson<T>(response: Response): Promise<T | undefined> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}

async function loadWorkingEntry(
  entityId: string,
  language: string,
  cookieHeader: string | undefined
): Promise<StaEntryDto | null> {
  const url = `${editorApiBaseUrl()}/sta-content/entities/${encodeURIComponent(entityId)}?stage=working&language=${encodeURIComponent(language)}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    return null;
  }
  return (await readJson<StaEntryDto>(response)) ?? null;
}

async function importLegacyEntity(
  entityId: string,
  wb: string,
  language: string,
  cookieHeader: string | undefined
): Promise<{ status: number; entry?: StaEntryDto; error?: { message?: string; details?: string } }> {
  const url = `${editorApiBaseUrl()}/sta-content/entities/${encodeURIComponent(entityId)}/import-from-wikibase?wb=${encodeURIComponent(wb)}&language=${encodeURIComponent(language)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: '{}',
  });
  const body = await readJson<StaEntryDto | Record<string, unknown>>(response);
  if (response.ok && body && typeof body === 'object' && 'entityId' in body) {
    return { status: response.status, entry: body as StaEntryDto };
  }
  const err = body as Record<string, unknown> | undefined;
  return {
    status: response.status,
    error: {
      message: typeof err?.message === 'string' ? err.message : undefined,
      details: typeof err?.details === 'string' ? err.details : undefined,
    },
  };
}

function wrapEntry(
  entry: StaEntryDto,
  entityId: string,
  alreadyPresent: boolean
): ImportResponseBody {
  return {
    entry,
    entityId: entry.entityId ?? entityId,
    staNotation: entry.staNotation,
    alreadyPresent,
  };
}

/** Import by Wikibase id or STA-Notation; proxies to product API with legacy fallback. */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const identifier =
    typeof req.body?.identifier === 'string' ? req.body.identifier.trim() : '';
  const wb =
    typeof req.body?.wb === 'string' && req.body.wb.trim()
      ? req.body.wb.trim().toLowerCase()
      : 'edit';
  const language =
    typeof req.body?.language === 'string' && req.body.language.trim()
      ? req.body.language.trim()
      : 'de';

  if (!identifier) {
    return res.status(400).json({
      success: false,
      message: 'Invalid import request',
      details: 'identifier is required',
    });
  }

  const cookieHeader = req.headers.cookie;

  const upstream = `${editorApiBaseUrl()}/sta-content/import-from-wikibase`;
  const proxied = await fetch(upstream, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: JSON.stringify({ identifier, wb, language }),
  });

  if (proxied.status !== 404) {
    const body = await readJson<ImportResponseBody | Record<string, unknown>>(proxied);
    if (proxied.ok && body) {
      return res.status(200).json(body);
    }
    return res.status(proxied.status).json(
      body ?? {
        success: false,
        message: 'Import failed',
        details: `HTTP ${proxied.status}`,
      }
    );
  }

  const parsed = parseImportIdentifier(identifier);
  if (!parsed) {
    return res.status(400).json({
      success: false,
      message: 'Invalid import request',
      details: 'identifier is required',
    });
  }

  let entityId: string | null =
    parsed.kind === 'entityId' ? parsed.entityId : null;
  if (parsed.kind === 'staNotation') {
    entityId = await resolveStaNotationToEntityId(parsed.notation, wb);
    if (!entityId) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found in Wikibase',
        details: `STA-Notation not found in Wikibase: ${parsed.notation}`,
      });
    }
  }

  const existing = await loadWorkingEntry(entityId, language, cookieHeader);
  if (existing) {
    return res.status(200).json(wrapEntry(existing, entityId, true));
  }

  const imported = await importLegacyEntity(entityId, wb, language, cookieHeader);
  if (imported.status === 409) {
    const afterConflict = await loadWorkingEntry(entityId, language, cookieHeader);
    if (afterConflict) {
      return res.status(200).json(wrapEntry(afterConflict, entityId, true));
    }
  }
  if (imported.entry) {
    return res.status(200).json(wrapEntry(imported.entry, entityId, false));
  }

  return res.status(imported.status || 500).json({
    success: false,
    message: imported.error?.message ?? 'Error importing from Wikibase',
    details: imported.error?.details,
  });
}
