import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Load the project-root `.env` for CLI entrypoints such as `ts-node bin/data`.
 *
 * Next.js and Jest load env files themselves. This module must stay off the
 * server import graph: a dynamic path under `process.cwd()` makes Turbopack
 * trace the whole repository into the server output. The filename is a static
 * root file, so directory tracing is opted out.
 */
export const loadDotEnv = (): void => {
  const envPath = resolve(/*turbopackIgnore: true*/ process.cwd(), '.env');
  if (!existsSync(/*turbopackIgnore: true*/ envPath)) {
    return;
  }
  for (const rawLine of readFileSync(/*turbopackIgnore: true*/ envPath, 'utf8').split(
    '\n'
  )) {
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
