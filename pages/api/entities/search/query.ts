import { QueryResult } from '@/types/search';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'solr-client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = createClient({
    core: 'entities',
    host: `${process.env.solrHost ?? ''}`,
  });

  const { query: requestedQuery, start } = req.query as {
    query: string;
    start: string;
  };
  const buildQueryStatement = (requestedQuery: string) => {
    let statementScore1 = '';
    let statementScore2 = '';
    let statementScore3 = '';
    let statementScore4 = '';
    let statementScore5 = '';
    let statementScore6 = '';
    const words = [];
    const phraseSearch = requestedQuery.match(/"(.*?)"/g);
    if (phraseSearch) {
      words.push(...phraseSearch);
    } else {
      const trim = requestedQuery
        .replace(/[^\w\s]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');
      words.push(...trim);
    }
    words.map((word, index) => {
      const scoreLevel1 = `headline.title:${word}^30`;
      const scoreLevel2 = `headline.title:*${word}*^20`;
      const scoreLevel3 = `headline-text-search:${word}^20`;
      const scoreLevel4 = `headline-text-search:*${word}*^10`;
      const scoreLevel5 = `staNotationLabel:${word}*^10`;
      const scoreLevel6 = `full-text-search:${word}^10`;
      if (index == 0) {
        statementScore1 += scoreLevel1;
        statementScore2 += scoreLevel2;
        statementScore3 += scoreLevel3;
        statementScore4 += scoreLevel4;
        statementScore5 += scoreLevel5;
        statementScore6 += scoreLevel6;
      } else {
        statementScore1 += ' AND ' + scoreLevel1;
        statementScore2 += ' AND ' + scoreLevel2;
        statementScore3 += ' AND ' + scoreLevel3;
        statementScore4 += ' AND ' + scoreLevel4;
        statementScore5 += ' AND ' + scoreLevel5;
        statementScore6 += ' AND ' + scoreLevel6;
      }
    });
    return `((${statementScore1}) OR (${statementScore2}) OR (${statementScore3}) OR (${statementScore4}) OR (${statementScore5}) OR (${statementScore6}))`;
  };
  const query = buildQueryStatement(requestedQuery);
  const solrQuery = client
    .query()
    .q(`${query}`)
    .qop('AND')
    .sort({ score: 'desc' })
    .fl(`*,score`)
    .rows(10);

  if (start) {
    solrQuery.start(Number(start));
  }

  const queryResult = (await client.search(solrQuery)) as unknown as QueryResult;

  res.status(200).json(queryResult);
};
