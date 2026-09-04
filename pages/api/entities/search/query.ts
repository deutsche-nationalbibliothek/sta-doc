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

  console.log(requestedQuery, start); // hinterher wieder entfernen

  const buildQueryStatement = (requestedQuery: string) => {
    const phraseSearch = requestedQuery.match(/"(.*?)"/g); // macht daraus ein Array

    console.log("phaseSearch:", phraseSearch)
    
    let statementScore1 = '';
    let statementScore2 = '';
    let statementScore3 = '';
    let statementScore4 = '';
    let statementScore5 = '';
    let statementScore6 = '';
    
    if (phraseSearch) {
      const phrases = phraseSearch;

    phrases.map((phrase, index) => {
    const scoreLevel1 = `headline.title:${phrase}^30`;
    const scoreLevel2 = `headline.title:*${phrase}*^20`; // Brauchen wir den Score hier? Funktioniert wildcard wie angenommen?
    const scoreLevel3 = `headline-text-search:${phrase}^20`;
    const scoreLevel4 = `headline-text-search:*${phrase}*^10`; // Hier genauso. Brauchen wir den Score hier?
    // ScoreLevel5 mit staNotation rausgelassen
    const scoreLevel6 = `full-text-search:${phrase}^10`;
    if (index == 0) {
      statementScore1 += scoreLevel1;
      statementScore2 += scoreLevel2;
      statementScore3 += scoreLevel3;
      statementScore4 += scoreLevel4;
      // hier wieder staNotation rausgelassen
      statementScore6 += scoreLevel6;
    } else {
      statementScore1 += ' AND ' + scoreLevel1;
      statementScore2 += ' AND ' + scoreLevel2;
      statementScore3 += ' AND ' + scoreLevel3;
      statementScore4 += ' AND ' + scoreLevel4;
      // hier wieder staNotation rausgelassen
      statementScore6 += ' AND ' + scoreLevel6;
    }});

    return `((${statementScore1}) OR (${statementScore2}) OR (${statementScore3}) OR (${statementScore4}) OR (${statementScore6}))`;
    
    } else {
      const words = requestedQuery
        .replace(/[^\w\s]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' '); // ist am Ende auch ein Array

      console.log("words", words)
      words.map((word, index) => {
        const scoreLevel1 = `headline.title:${word}^30`;
        const scoreLevel2 = `headline.title:*${word}*^20`;
        const scoreLevel3 = `headline-text-search:${word}^20`;
        const scoreLevel4 = `headline-text-search:*${word}*^10`;
        const scoreLevel5 = `(staNotationLabel:${word}^50 OR staNotationLabel:${word.toLowerCase()}*^40)`;
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
    }
  };
  
  const query = buildQueryStatement(requestedQuery);

  // const query = `(headline.title:"bewegtes bild") OR (headline.title:*"bewegtes bild"*) OR (headline-text-search:"bewegtes bild") OR (headline-text-search: *"bewegtes bild"*) OR (staNotationLabel:"bewegtes bild") OR (staNotationLabel:"bewegtes bild"*) OR (full-text-search:"bewegtes bild")`;

  // const query = `((headline.title:"bewegtes bild"^30) OR (headline.title:*"bewegtes bild"*^20) OR (headline-text-search:"bewegtes bild"^20) OR (headline-text-search:*"bewegtes bild"*^10) OR ((staNotationLabel:"bewegtes bild"^50 OR staNotationLabel:"bewegtes bild"*^40)) OR (full-text-search:"bewegtes bild"^10))`;

  // const query = `staNotationLabel:"bewegtes bild"* OR staNotationLabel:"bewegtes bild"`; // liefert 0 Treffer

  // const query = `staNotationLabel:"bewegtes bild" OR staNotationLabel:"bewegtes bild"*`; // liefert 3680 Treffer

  const queryResult = await solrGet<QueryResult>('select', {
    q: query,
    'q.op': 'AND',
    sort: 'score desc',
    fl: SEARCH_RESULT_FIELDS,
    rows: 10,
    // debug='all',
    ...(start ? { start: Number(start) } : {}),
  });

  console.log("solr query:", query);
  console.log("solr query result:", queryResult)
  console.log("solr num found:", queryResult.response?.numFound);
  console.log("solr docs:", queryResult.response?.docs?.length);

  res.status(200).json(queryResult);
};
