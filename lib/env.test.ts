import { mediawikiUrl } from './env';

describe('mediawikiUrl', () => {
  const originalUrl = process.env.NEXT_PUBLIC_URL;

  afterEach(() => {
    if (originalUrl === undefined) {
      delete process.env.NEXT_PUBLIC_URL;
    } else {
      process.env.NEXT_PUBLIC_URL = originalUrl;
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
});
