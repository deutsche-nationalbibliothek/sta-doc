import { describe, expect, it } from '@jest/globals';
import { wikibaseStatementUrl } from './wikibase-statement-url';

describe('wikibaseStatementUrl', () => {
  it('builds Item statement URLs with hash fragment', () => {
    expect(
      wikibaseStatementUrl(
        'Q42$abc-def',
        'https://edit.example.test'
      )
    ).toBe('https://edit.example.test/wiki/Item:Q42#Q42$abc-def');
  });

  it('uses Property namespace for property ids', () => {
    expect(
      wikibaseStatementUrl('P31$xyz', 'https://edit.example.test/')
    ).toBe('https://edit.example.test/wiki/Property:P31#P31$xyz');
  });
});
