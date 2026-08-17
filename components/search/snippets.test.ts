import { collectSearchSnippets, firstStaNotationLabel } from './snippets';
import { Doc } from '@/types/search';

const doc = (
  overrides: Partial<
    Pick<
      Doc,
      | 'staNotationLabel'
      | 'headline.title'
      | 'headline-text-search'
      | 'full-text-search'
    >
  >
) =>
  ({
    'headline.title': ['Resource Description and Access'],
    'headline-text-search': ['Resource Description and Access'],
    'full-text-search': [],
    staNotationLabel: 'RDA',
    ...overrides,
  }) as Pick<
    Doc,
    | 'staNotationLabel'
    | 'headline.title'
    | 'headline-text-search'
    | 'full-text-search'
  >;

describe('search snippets', () => {
  it('reads staNotationLabel whether Solr returns a string or an array', () => {
    expect(firstStaNotationLabel('RDA')).toBe('RDA');
    expect(firstStaNotationLabel(['RDA'])).toBe('RDA');
    expect(firstStaNotationLabel(undefined)).toBe('');
  });

  it('puts a matching STA notation first, ahead of other highlighted content', () => {
    const snippets = collectSearchSnippets(
      doc({
        'headline-text-search': [
          'Resource Description and Access',
          'RDA Toolkit section',
        ],
        'full-text-search': ['See also RDA in the body text', 'RDA'],
      }),
      'RDA'
    );

    expect(snippets.staNotationMatch).toBe('RDA');
    expect(snippets.headlineMatches).toEqual(['RDA Toolkit section']);
    expect(snippets.fulltextMatches).toEqual(['See also RDA in the body text']);
  });

  it('matches STA notation case-insensitively and for multi-word queries', () => {
    expect(collectSearchSnippets(doc({}), 'rda').staNotationMatch).toBe('RDA');
    expect(
      collectSearchSnippets(doc({}), 'RDA Toolkit').staNotationMatch
    ).toBe('RDA');
  });

  it('omits STA notation when it does not match or duplicates the title', () => {
    expect(
      collectSearchSnippets(doc({}), 'GND').staNotationMatch
    ).toBeUndefined();
    expect(
      collectSearchSnippets(
        doc({
          'headline.title': ['RDA'],
          'headline-text-search': ['RDA'],
        }),
        'RDA'
      ).staNotationMatch
    ).toBeUndefined();
  });
});
