import { escapeSpecialChars, solrGet } from '@/lib/solr/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query: requestedQuery } = req.query as {
    query: string;
    start: string;
  };

  const query = escapeSpecialChars(requestedQuery);

  // http://localhost:8983/solr/entities/spell?df=text&spellcheck.q=form&spellcheck=true&spellcheck.collateParam.q.op=AND&wt=xml&spellcheck.build=true

  // const suggestionsResult = await solrGet('spell', {
  //   q: query,
  //   spellcheck: true,
  //   build: true,
  // });

  const suggestionsResult = await solrGet('select', {
    q: `headline.title:*${query}*`, // search within field headline.title
    fl: 'id,headline.title', // return only id and headline.title from field list
    rows: 6,
  });

  res.status(200).json(suggestionsResult);
};
