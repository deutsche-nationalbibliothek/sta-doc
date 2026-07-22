const SOLR_CORE = 'entities';
const SOLR_PATH = '/solr';

export const escapeSpecialChars = (s: string): string =>
  s
    .replace(/([\+\-!\(\)\{\}\[\]\^"~\*\?:\\\/])/g, (match) => `\\${match}`)
    .replace(/&&/g, '\\&\\&')
    .replace(/\|\|/g, '\\|\\|');

const solrBaseUrl = () => {
  const host = process.env.solrHost ?? 'localhost';
  const port = process.env.solrPort ?? '8983';
  return `http://${host}:${port}${SOLR_PATH}/${SOLR_CORE}`;
};

export async function solrGet<T>(
  handler: string,
  params: Record<string, string | number | boolean>
): Promise<T> {
  const searchParams = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ),
    wt: 'json',
  });

  const response = await fetch(`${solrBaseUrl()}/${handler}?${searchParams}`);

  if (!response.ok) {
    throw new Error(
      `Solr ${handler} request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}
