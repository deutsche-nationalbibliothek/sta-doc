const SOLR_CORE = 'entities';
const SOLR_PATH = '/solr';

export const escapeSpecialChars = (s: string): string =>
  s
    .replace(/([\+\-!\(\)\{\}\[\]\^"~\*\?:\\\/])/g, (match) => `\\${match}`)
    .replace(/&&/g, '\\&\\&')
    .replace(/\|\|/g, '\\|\\|');

const solrHost = () =>
  process.env.solrHost || process.env.SOLR_HOST || 'localhost';

const solrPort = () =>
  process.env.solrPort || process.env.SOLR_PORT || '8983';

export const solrBaseUrl = () =>
  `http://${solrHost()}:${solrPort()}${SOLR_PATH}/${SOLR_CORE}`;

const toSearchParams = (
  params: Record<string, string | number | boolean>
): string =>
  new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    )
  ).toString();

const throwIfNotOk = async (
  response: Response,
  handler: string
): Promise<void> => {
  if (response.ok) {
    return;
  }
  const body = await response.text();
  throw new Error(
    `Solr ${handler} request failed: ${response.status} ${response.statusText}${
      body ? ` — ${body}` : ''
    }`
  );
};

export async function solrGet<T>(
  handler: string,
  params: Record<string, string | number | boolean>
): Promise<T> {
  const searchParams = toSearchParams({ ...params, wt: 'json' });
  const response = await fetch(`${solrBaseUrl()}/${handler}?${searchParams}`);
  await throwIfNotOk(response, handler);
  return response.json() as Promise<T>;
}

export async function solrPost<T>(
  handler: string,
  body: unknown,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  const qs = toSearchParams({ ...params, wt: 'json' });
  const response = await fetch(`${solrBaseUrl()}/${handler}?${qs}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  await throwIfNotOk(response, handler);
  return response.json() as Promise<T>;
}

export const solrPing = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${solrBaseUrl()}/admin/ping?wt=json`);
    return response.ok;
  } catch {
    return false;
  }
};

export const solrCommit = () => solrPost('update', { commit: {} });

export const solrDeleteByIds = (ids: string[]) =>
  solrPost('update', { delete: ids });

export const solrAddDocuments = (docsJson: string) =>
  solrPost('update/json/docs', docsJson, { overwrite: true });

export async function solrListFilenames(): Promise<string[]> {
  const filenames: string[] = [];
  let cursorMark = '*';

  for (;;) {
    const result = await solrGet<{
      nextCursorMark: string;
      response: { docs: Array<{ filename?: string }> };
    }>('select', {
      q: '*:*',
      fl: 'filename',
      rows: 1000,
      sort: 'filename asc',
      cursorMark,
    });

    for (const doc of result.response.docs) {
      if (doc.filename) {
        filenames.push(doc.filename);
      }
    }

    if (result.nextCursorMark === cursorMark) {
      break;
    }
    cursorMark = result.nextCursorMark;
  }

  return filenames;
}
