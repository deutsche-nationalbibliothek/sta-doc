/**
 * Feature flags for incremental editor / Postgres migration.
 * Default when unset: **legacy** (false) — sta-doc behaves like pre-editor sta-doc.
 *
 * Client UI: NEXT_PUBLIC_* (build-time in Next.js).
 * BFF / API routes: STA_POSTGRES_READ_ENABLED (runtime on server; falls back to NEXT_PUBLIC).
 */

function parseEnvFlag(value: string | undefined): boolean {
  if (value == null || value === '') {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

/** Editor login, Bearbeiten-UI, /edit routes, Save/Import (client). */
export function isEditorEnabled(): boolean {
  return parseEnvFlag(process.env.NEXT_PUBLIC_STA_EDITOR_ENABLED);
}

/** Postgres stage read in the browser (?stage=, banner, SWR). */
export function isPostgresReadEnabledClient(): boolean {
  return parseEnvFlag(process.env.NEXT_PUBLIC_STA_POSTGRES_READ_ENABLED);
}

/** BFF: /api/entities?stage= → editor view-raw. Server runtime env preferred. */
export function isPostgresReadEnabledServer(): boolean {
  const server = process.env.STA_POSTGRES_READ_ENABLED;
  if (server != null && server !== '') {
    return parseEnvFlag(server);
  }
  return isPostgresReadEnabledClient();
}

/** Convenience for React components (client bundle). */
export const editorFeatures = {
  get editorEnabled() {
    return isEditorEnabled();
  },
  get postgresReadEnabled() {
    return isPostgresReadEnabledClient();
  },
} as const;
