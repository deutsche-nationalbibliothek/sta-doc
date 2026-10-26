/** Server-side upstream to WildFly sta-doc-api (see .env.example). */
export function editorApiBaseUrl(): string {
  const fromEnv =
    process.env.EDITOR_API_URL ||
    process.env.EDITOR_API_UPSTREAM ||
    '';
  if (fromEnv && /^https?:\/\//i.test(fromEnv)) {
    return fromEnv.replace(/\/$/, '');
  }
  const pub = process.env.NEXT_PUBLIC_EDITOR_API_URL || '';
  if (pub && /^https?:\/\//i.test(pub)) {
    return pub.replace(/\/$/, '');
  }
  return 'http://localhost:8080/sta-doc-api/api';
}

export function parseImportIdentifier(
  raw: string
): { kind: 'entityId'; entityId: string } | { kind: 'staNotation'; notation: string } | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  if (/^[PQpq]\d+$/.test(trimmed)) {
    return { kind: 'entityId', entityId: trimmed.toUpperCase() };
  }
  return { kind: 'staNotation', notation: trimmed };
}

const WB_HOST: Record<string, string> = {
  edit: 'https://edit.sta.dnb.de',
  live: 'https://sta.dnb.de',
  lab: 'https://lab.sta.dnb.de',
};

/** Resolve STA-Notation (P643) via Wikibase SPARQL (same query as bin/import-page.ps1). */
export async function resolveStaNotationToEntityId(
  notation: string,
  wb: string
): Promise<string | null> {
  const apiUrl = WB_HOST[wb] ?? WB_HOST.edit;
  const escaped = notation.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const query = `
PREFIX prop: <${apiUrl}/prop/direct/>
SELECT ?eId WHERE {
  ?element prop:P643 "${escaped}" .
  BIND(STRAFTER(STR(?element), '/entity/') AS ?eId)
}
LIMIT 5`.trim();
  const endpoint = `${apiUrl}/query/proxy/wdqs/bigdata/namespace/wdq/sparql`;
  const uri = `${endpoint}?query=${encodeURIComponent(query)}`;
  const response = await fetch(uri, {
    headers: { Accept: 'application/sparql-results+json' },
  });
  if (!response.ok) {
    return null;
  }
  const json = (await response.json()) as {
    results?: { bindings?: Array<{ eId?: { value?: string } }> };
  };
  const ids =
    json.results?.bindings
      ?.map((b) => b.eId?.value?.trim())
      .filter((id): id is string => Boolean(id)) ?? [];
  return ids[0] ?? null;
}
