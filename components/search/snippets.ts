import { Doc } from '@/types/search';
import { uniq } from 'lodash';

export type SearchSnippetDoc = Pick<
  Doc,
  | 'staNotationLabel'
  | 'headline.title'
  | 'headline-text-search'
  | 'full-text-search'
>;

export const firstStaNotationLabel = (
  value: string | string[] | undefined
): string => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
};

export const normalizeSearchQuery = (query: string): string =>
  query.toLowerCase().replace(/"+/g, '').trim();

const queryWords = (normalizedQuery: string): string[] =>
  normalizedQuery
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((word) => word.length >= 2);

export const isStaNotationSnippetMatch = (
  staNotationLabel: string,
  query: string
): boolean => {
  if (!staNotationLabel) {
    return false;
  }
  const haystack = staNotationLabel.toLowerCase();
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) {
    return false;
  }
  if (haystack.includes(normalizedQuery)) {
    return true;
  }
  return queryWords(normalizedQuery).some((word) => haystack.includes(word));
};

export const collectSearchSnippets = (doc: SearchSnippetDoc, query: string) => {
  const title = doc['headline.title']?.[0];
  const normalizedQuery = normalizeSearchQuery(query);
  const staNotation = firstStaNotationLabel(doc.staNotationLabel);
  const staNotationMatch =
    staNotation &&
    staNotation !== title &&
    isStaNotationSnippetMatch(staNotation, query)
      ? staNotation
      : undefined;

  const matchesFullQuery = (docValue: string) =>
    Boolean(normalizedQuery) &&
    docValue.toLowerCase().includes(normalizedQuery);

  const headlineMatches = uniq(
    (doc['headline-text-search'] ?? []).filter(
      (docValue) =>
        matchesFullQuery(docValue) &&
        docValue !== title &&
        docValue !== staNotationMatch
    )
  );

  const fulltextMatches = uniq(
    (doc['full-text-search'] ?? []).filter(
      (docValue) =>
        matchesFullQuery(docValue) &&
        docValue !== title &&
        docValue !== staNotationMatch &&
        headlineMatches.every((headlineMatch) => headlineMatch !== docValue)
    )
  );

  return { staNotationMatch, headlineMatches, fulltextMatches };
};
