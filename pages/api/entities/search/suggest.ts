import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'solr-client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = createClient({
    core: 'entities',
    host: `${process.env.solrHost ?? ''}`,
  });

  const { query: requestedQuery } = req.query as {
    query: string;
    start: string;
  };
  const query = (client.escapeSpecialChars as (s: string) => string)(
    requestedQuery
  );

  // http://localhost:8983/solr/entities/spell?df=text&spellcheck.q=form&spellcheck=true&spellcheck.collateParam.q.op=AND&wt=xml&spellcheck.build=true
  const suggestionsResult = await client.doQuery('spell', {
    q: query,
    spellcheck: true,
    build: true,
  });

  res.status(200).json(suggestionsResult);
};
