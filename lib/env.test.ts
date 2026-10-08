import { afterEach, describe, expect, it } from '@jest/globals';
import {
  apiUrlLive,
  apiUrlProd,
  apiUrlTest,
  hostnameFromUrl,
  mediawikiUrl,
  canonicalWikiBase,
  mediawikiTransportUrl,
  normalizeWikiBase,
  resolveMediawikiFetchUrl,
} from './env';

describe('mediawiki and live wiki URLs', () => {
  const keys = [
    'NEXT_PUBLIC_URL',
    'MEDIAWIKI_FETCH_URL',
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

  it('strips trailing slashes from wiki base URLs', () => {
    expect(normalizeWikiBase('https://edit.example.test/')).toBe(
      'https://edit.example.test'
    );
  });

  it('upgrades http to https for public wiki hosts', () => {
    expect(canonicalWikiBase('http://edit.sta.dnb.de')).toBe(
      'https://edit.sta.dnb.de'
    );
    expect(canonicalWikiBase('http://127.0.0.1:8080')).toBe(
      'http://127.0.0.1:8080'
    );
  });

  it('uses https canonical URL when NEXT_PUBLIC_URL is http on a public host', () => {
    process.env.NEXT_PUBLIC_URL = 'http://edit.sta.dnb.de';
    expect(mediawikiUrl()).toBe('https://edit.sta.dnb.de');
  });

  it('uses http transport for public hosts while keeping https IRIs', () => {
    expect(mediawikiTransportUrl('https://edit.sta.dnb.de')).toBe(
      'http://edit.sta.dnb.de'
    );
    expect(mediawikiTransportUrl('http://127.0.0.1:8080')).toBe(
      'http://127.0.0.1:8080'
    );
  });

  it('uses http transport when MEDIAWIKI_FETCH_URL is unset', () => {
    delete process.env.MEDIAWIKI_FETCH_URL;
    process.env.NEXT_PUBLIC_URL = 'https://example.mediawiki.test';
    expect(resolveMediawikiFetchUrl('https://example.mediawiki.test')).toBe(
      'http://example.mediawiki.test'
    );
  });

  it('maps prod canonical URLs to a custom MEDIAWIKI_FETCH_URL', () => {
    process.env.NEXT_PUBLIC_URL = 'https://edit.example.test';
    process.env.API_URL_PROD = 'https://prod.example.test';
    process.env.MEDIAWIKI_FETCH_URL = 'http://127.0.0.1:8080';
    expect(resolveMediawikiFetchUrl('https://edit.example.test/')).toBe(
      'http://127.0.0.1:8080'
    );
    expect(resolveMediawikiFetchUrl('https://prod.example.test')).toBe(
      'http://127.0.0.1:8080'
    );
  });

  it('ignores mediawiki.svc and uses public http transport for prod wiki', () => {
    process.env.NEXT_PUBLIC_URL = 'https://edit.sta.dnb.de';
    process.env.MEDIAWIKI_FETCH_URL = 'http://mediawiki.svc';
    expect(resolveMediawikiFetchUrl('https://edit.sta.dnb.de')).toBe(
      'http://edit.sta.dnb.de'
    );
  });

  it('leaves unrelated canonical URLs unchanged when MEDIAWIKI_FETCH_URL is set', () => {
    process.env.MEDIAWIKI_FETCH_URL = 'http://mediawiki.svc';
    process.env.API_URL_TEST = 'http://lab.example.test';
    expect(resolveMediawikiFetchUrl('http://lab.example.test')).toBe(
      'http://lab.example.test'
    );
  });
});
