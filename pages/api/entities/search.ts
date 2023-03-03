import console from 'console';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'solr-client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = createClient({ core: 'entities', host: 'solr' });

  const { query, start } = req.query as { query: string; start: string };
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
    .qop('AND')
    .rows(10);

  if (start) {
    solrQuery.start(Number(start));
  }

  console.log({ qString: `${query}`, solrQuery });

  const queryResult = await client.search(solrQuery);

  res.status(200).json(queryResult);
};
