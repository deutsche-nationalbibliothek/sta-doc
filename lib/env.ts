import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const DEFAULT_MEDIAWIKI_URL = 'https://sta.dnb.de';

export const loadDotEnv = (filename = '.env') => {
  const envPath = resolve(process.cwd(), filename);
  if (!existsSync(envPath)) {
    return;
  }
  for (const rawLine of readFileSync(envPath, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const separator = line.indexOf('=');
    if (separator <= 0) {
      continue;
    }
    const key = line.slice(0, separator);
    let value = line.slice(separator + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

loadDotEnv();

export const mediawikiUrl = (): string =>
  process.env.NEXT_PUBLIC_URL || DEFAULT_MEDIAWIKI_URL;
