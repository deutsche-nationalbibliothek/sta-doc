import { QueryResult } from '@/types/search';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'solr-client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = createClient({ core: 'entities', host: 'localhost' });

  const { query: requestedQuery, start } = req.query as {
    query: string;
    start: string;
  };
  const query: string = client.escapeSpecialChars(requestedQuery);
  const solrQuery = client
    .query()
    .q(
      `\
headline.title:${query}^40 \
OR headline.title:${query}*^30 \
OR headline-text-search:${query}^20 \
OR headline-text-search:${query}*^10 \
OR full-text-search:${query}* \
`
    )
    .sort({ score: 'desc' })
    .fl(`*,score`)
    // .qop('AND')
    .rows(10);

  if (start) {
    solrQuery.start(Number(start));
  }

  const queryResult = (await client.search(solrQuery)) as QueryResult;

  // http://localhost:8983/solr/entities/spell?df=text&spellcheck.q=form&spellcheck=true&spellcheck.collateParam.q.op=AND&wt=xml&spellcheck.build=true
  const suggestionsResult = await client.doQuery('spell', {
    q: query,
    spellcheck: true,
    build: true,
  });

  res.status(200).json({ query: queryResult, suggestions: suggestionsResult });
};
