const SOLR_CORE = 'entities';
const SOLR_PATH = '/solr';

export const escapeSpecialChars = (s: string): string =>
  s
    .replace(/([\+\-!\(\)\{\}\[\]\^"~\*\?:\\\/])/g, (match) => `\\${match}`)
    .replace(/&&/g, '\\&\\&')
    .replace(/\|\|/g, '\\|\\|');

export const solrHost = () =>
  process.env.SOLR_HOST || process.env.solrHost || 'localhost';

export const solrPort = () =>
  process.env.SOLR_PORT || process.env.solrPort || '8983';

export const solrHostCandidates = (): string[] => [
  ...new Set(
    [process.env.SOLR_HOST, process.env.solrHost, 'localhost'].filter(
      (host): host is string => Boolean(host)
    )
  ),
];

export const useSolrHost = (host: string) => {
  process.env.SOLR_HOST = host;
};

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

export const solrAdminIsUp = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      `http://${solrHost()}:${solrPort()}${SOLR_PATH}/admin/info/system?wt=json`
    );
    return response.ok;
  } catch {
    return false;
  }
};

export const solrCreateCore = async (): Promise<boolean> => {
  try {
    const params = new URLSearchParams({
      action: 'CREATE',
      name: SOLR_CORE,
      instanceDir: '/opt/solr-9.1.1/entities',
      wt: 'json',
    });
    const response = await fetch(
      `http://${solrHost()}:${solrPort()}${SOLR_PATH}/admin/cores?${params}`
    );
    if (response.ok) {
      return true;
    }
    const body = await response.text();
    return /already exists/i.test(body);
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
