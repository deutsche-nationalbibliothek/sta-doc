import { describe, expect, it } from '@jest/globals';
import {
  normalizeEntityLocale,
  resolveEntityLocale,
} from './locale-utils';

describe('resolveEntityLocale', () => {
  it('prefers next-translate lang over router locale', () => {
    expect(
      resolveEntityLocale({ locale: 'de', asPath: '/RDA-R-BILD' }, 'fr')
    ).toBe('fr');
  });

  it('detects French routes from asPath when router locale is unset', () => {
    expect(
      resolveEntityLocale({ asPath: '/fr/RDA-R-BILD' }, undefined)
    ).toBe('fr');
  });

  it('defaults to de for German paths', () => {
    expect(resolveEntityLocale({ asPath: '/RDA-R-BILD' }, undefined)).toBe(
      'de'
    );
  });
});

describe('normalizeEntityLocale', () => {
  it('maps to de or fr only', () => {
    expect(normalizeEntityLocale('fr')).toBe('fr');
    expect(normalizeEntityLocale('de')).toBe('de');
    expect(normalizeEntityLocale(undefined)).toBe('de');
    expect(normalizeEntityLocale('en')).toBe('de');
  });
});
