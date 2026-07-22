import { solrGet } from '@/lib/solr/client';
import { QueryResult } from '@/types/search';
import type { NextApiRequest, NextApiResponse } from 'next';

const SEARCH_RESULT_FIELDS = [
  'id',
  'staNotationLabel',
  'headline.title',
  'headline-text-search',
  'full-text-search',
  'namespace',
  'pageType.labelDe',
  '*headline.title',
  '*headline.key',
  'score',
].join(',');

export default async (req: NextApiRequest, res: NextApiResponse) => {
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

  const queryResult = await solrGet<QueryResult>('select', {
    q: query,
    'q.op': 'AND',
    sort: 'score desc',
    fl: SEARCH_RESULT_FIELDS,
    rows: 10,
    ...(start ? { start: Number(start) } : {}),
  });

  res.status(200).json(queryResult);
};
