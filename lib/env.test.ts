import {
  apiUrlLive,
  apiUrlProd,
  apiUrlTest,
  hostnameFromUrl,
  mediawikiUrl,
} from './env';

describe('mediawiki and live wiki URLs', () => {
  const keys = [
    'NEXT_PUBLIC_URL',
    'API_URL_LIVE',
    'API_URL_PROD',
    'API_URL_TEST',
  ] as const;
  const original = Object.fromEntries(
    keys.map((key) => [key, process.env[key]])
  );

  afterEach(() => {
    for (const key of keys) {
      if (original[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = original[key];
      }
    }
  });

  it('uses NEXT_PUBLIC_URL when set', () => {
    process.env.NEXT_PUBLIC_URL = 'https://example.mediawiki.test';
    expect(mediawikiUrl()).toBe('https://example.mediawiki.test');
  });

  it('falls back to the edit host when NEXT_PUBLIC_URL is unset', () => {
    delete process.env.NEXT_PUBLIC_URL;
    expect(mediawikiUrl()).toBe('https://edit.sta.dnb.de');
  });

  it('uses env overrides for live/prod/test wiki URLs', () => {
    process.env.API_URL_LIVE = 'https://live.example.test';
    process.env.API_URL_PROD = 'https://prod.example.test';
    process.env.API_URL_TEST = 'http://test.example.test';
    expect(apiUrlLive()).toBe('https://live.example.test');
    expect(apiUrlProd()).toBe('https://prod.example.test');
    expect(apiUrlTest()).toBe('http://test.example.test');
  });

  it('extracts the hostname from a wiki URL', () => {
    expect(hostnameFromUrl('https://edit.sta.dnb.de')).toBe('edit.sta.dnb.de');
    expect(hostnameFromUrl('http://lab.sta.dnb.de/wiki')).toBe('lab.sta.dnb.de');
  });
});
