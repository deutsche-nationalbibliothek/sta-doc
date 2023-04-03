import { QueryResult } from '@/types/search';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'solr-client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = createClient({ core: 'entities', host: `${process.env.solrHost}` })

  const { query: requestedQuery, start } = req.query as {
    query: string;
    start: string;
  };
  const query = (client.escapeSpecialChars as (s: string) => string)(
    requestedQuery
  );
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

  res.status(200).json(queryResult);
};
