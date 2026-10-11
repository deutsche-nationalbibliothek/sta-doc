/**
 * Compare sta-doc parsed entity maps (Postgres pipeline vs Wikibase pipeline).
 *
 * Usage (from sta-doc/):
 *   npx ts-node bin/data/compare-parsed.ts --pg=../exports/diff/pg-parsed --wb=../exports/diff/wb-parsed
 *   npx ts-node bin/data/compare-parsed.ts --pg=... --wb=... --ids=P531,Q3223 --lang=de --out=../exports/diff/report
 *
 * Env / flags:
 *   --pg=DIR     parsed output from DATA_SOURCE=postgres (contains entities-de.json)
 *   --wb=DIR     parsed output from Wikibase fetch
 *   --ids=A,B    optional id filter (default: all ids present in PG file)
 *   --ids-file=PATH  optional file with one id per line
 *   --lang=de|fr (default de)
 *   --out=DIR    write parallel-diff-report.md + .json (optional)
 *   --max-diffs=N  max path samples per entity (default 25)
 */
import fs from 'fs';
import path from 'path';

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

interface EntityDiff {
  id: string;
  status: 'equal' | 'differ' | 'onlyPg' | 'onlyWb';
  summary?: Record<string, { pg: unknown; wb: unknown }>;
  pathDiffs?: string[];
}

interface Report {
  lang: string;
  pgFile: string;
  wbFile: string;
  comparedAt: string;
  totals: {
    compared: number;
    equal: number;
    differ: number;
    onlyPg: number;
    onlyWb: number;
  };
  entities: EntityDiff[];
}

const arg = (name: string): string | undefined => {
  const prefix = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
};

const hasFlag = (name: string) => process.argv.includes(`--${name}`);

const readIdList = (): string[] | undefined => {
  const fromArg = arg('ids')
    ?.split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const file = arg('ids-file');
  if (!file) {
    return fromArg?.length ? fromArg : undefined;
  }
  const lines = fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return '';
      }
      const hash = trimmed.indexOf('#');
      return (hash >= 0 ? trimmed.slice(0, hash) : trimmed).trim();
    })
    .filter(Boolean);
  const merged = [...(fromArg ?? []), ...lines];
  return merged.length ? [...new Set(merged)] : undefined;
};
const readEntities = (dir: string, lang: string): Record<string, Json> => {
  const fileName = lang === 'fr' ? 'entities-fr.json' : 'entities-de.json';
  const filePath = path.join(dir, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing parsed entities file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, Json>;
};

const stableStringify = (value: Json): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v as Json)).join(',')}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${stableStringify(value[k] as Json)}`)
    .join(',')}}`;
};

const collectPathDiffs = (
  pg: Json,
  wb: Json,
  base: string,
  out: string[],
  max: number
): void => {
  if (out.length >= max) {
    return;
  }
  if (stableStringify(pg) === stableStringify(wb)) {
    return;
  }
  const pgObj = pg !== null && typeof pg === 'object' && !Array.isArray(pg);
  const wbObj = wb !== null && typeof wb === 'object' && !Array.isArray(wb);
  if (pgObj && wbObj) {
    const keys = new Set([
      ...Object.keys(pg as object),
      ...Object.keys(wb as object),
    ]);
    for (const key of [...keys].sort()) {
      if (out.length >= max) {
        return;
      }
      const p = (pg as { [k: string]: Json })[key];
      const w = (wb as { [k: string]: Json })[key];
      const next = base ? `${base}.${key}` : key;
      if (!(key in (pg as object))) {
        out.push(`${next}: only in wb`);
      } else if (!(key in (wb as object))) {
        out.push(`${next}: only in pg`);
      } else {
        collectPathDiffs(p, w, next, out, max);
      }
    }
    return;
  }
  if (Array.isArray(pg) && Array.isArray(wb)) {
    if (pg.length !== wb.length) {
      out.push(`${base}: array length pg=${pg.length} wb=${wb.length}`);
    }
    const n = Math.min(pg.length, wb.length, 50);
    for (let i = 0; i < n && out.length < max; i++) {
      collectPathDiffs(pg[i] as Json, wb[i] as Json, `${base}[${i}]`, out, max);
    }
    return;
  }
  out.push(
    `${base}: pg=${truncate(JSON.stringify(pg))} wb=${truncate(JSON.stringify(wb))}`
  );
};

const truncate = (s: string, n = 120) =>
  s.length <= n ? s : `${s.slice(0, n)}…`;

const countHeadlines = (value: Json): number => {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? '');
  const matches = text.match(/<h[1-6]\b/gi);
  return matches ? matches.length : 0;
};

const statementCount = (entity: Json): number => {
  if (!entity || typeof entity !== 'object' || Array.isArray(entity)) {
    return 0;
  }
  const statements = (entity as { statements?: unknown }).statements;
  if (Array.isArray(statements)) {
    return statements.length;
  }
  if (statements && typeof statements === 'object') {
    return Object.keys(statements as object).length;
  }
  return 0;
};

const labelOf = (entity: Json): string | undefined => {
  if (!entity || typeof entity !== 'object' || Array.isArray(entity)) {
    return undefined;
  }
  const e = entity as { label?: unknown; title?: unknown };
  if (typeof e.label === 'string') {
    return e.label;
  }
  if (typeof e.title === 'string') {
    return e.title;
  }
  return undefined;
};

const summarize = (pg: Json, wb: Json) => {
  const summary: Record<string, { pg: unknown; wb: unknown }> = {};
  const pairs: Array<[string, unknown, unknown]> = [
    ['label', labelOf(pg), labelOf(wb)],
    ['statementCount', statementCount(pg), statementCount(wb)],
    ['headlineCount', countHeadlines(pg), countHeadlines(wb)],
  ];
  for (const [key, p, w] of pairs) {
    if (p !== w) {
      summary[key] = { pg: p, wb: w };
    }
  }
  return summary;
};

const toMarkdown = (report: Report): string => {
  const lines: string[] = [
    `# Parallel-Diff (${report.lang})`,
    '',
    `Compared at: ${report.comparedAt}`,
    '',
    `- PG: \`${report.pgFile}\``,
    `- WB: \`${report.wbFile}\``,
    '',
    '## Totals',
    '',
    `| compared | equal | differ | onlyPg | onlyWb |`,
    `| --- | --- | --- | --- | --- |`,
    `| ${report.totals.compared} | ${report.totals.equal} | ${report.totals.differ} | ${report.totals.onlyPg} | ${report.totals.onlyWb} |`,
    '',
  ];
  const differing = report.entities.filter((e) => e.status === 'differ');
  if (differing.length) {
    lines.push('## Differing entities', '');
    for (const e of differing) {
      lines.push(`### ${e.id}`);
      if (e.summary && Object.keys(e.summary).length) {
        lines.push('', '| metric | pg | wb |', '| --- | --- | --- |');
        for (const [k, v] of Object.entries(e.summary)) {
          lines.push(`| ${k} | ${JSON.stringify(v.pg)} | ${JSON.stringify(v.wb)} |`);
        }
      }
      if (e.pathDiffs?.length) {
        lines.push('', 'Sample path diffs:', '');
        for (const d of e.pathDiffs) {
          lines.push(`- \`${d}\``);
        }
      }
      lines.push('');
    }
  }
  const onlyPg = report.entities.filter((e) => e.status === 'onlyPg').map((e) => e.id);
  const onlyWb = report.entities.filter((e) => e.status === 'onlyWb').map((e) => e.id);
  if (onlyPg.length) {
    lines.push('## Only in Postgres export', '', onlyPg.join(', '), '');
  }
  if (onlyWb.length) {
    lines.push('## Only in Wikibase (within compared id set)', '', onlyWb.join(', '), '');
  }
  return lines.join('\n');
};

const main = () => {
  if (hasFlag('help') || hasFlag('h')) {
    console.log(
      `Usage: ts-node bin/data/compare-parsed.ts --pg=DIR --wb=DIR [--ids=P1,Q2] [--ids-file=PATH] [--lang=de|fr] [--out=DIR]`
    );
    process.exit(0);
  }
  const pgDir = arg('pg');
  const wbDir = arg('wb');
  if (!pgDir || !wbDir) {
    console.error('Required: --pg=DIR --wb=DIR');
    process.exit(1);
  }
  const lang = (arg('lang') || 'de').toLowerCase();
  const maxDiffs = Number(arg('max-diffs') || '25');
  const pg = readEntities(pgDir, lang);
  const wb = readEntities(wbDir, lang);
  const pgIds = Object.keys(pg);
  const filter = readIdList();
  const ids = filter?.length ? filter : pgIds;

  const entities: EntityDiff[] = [];
  for (const id of ids) {
    const hasPg = id in pg;
    const hasWb = id in wb;
    if (!hasPg && !hasWb) {
      continue;
    }
    if (hasPg && !hasWb) {
      entities.push({ id, status: 'onlyPg' });
      continue;
    }
    if (!hasPg && hasWb) {
      entities.push({ id, status: 'onlyWb' });
      continue;
    }
    const equal = stableStringify(pg[id]) === stableStringify(wb[id]);
    if (equal) {
      entities.push({ id, status: 'equal' });
    } else {
      const pathDiffs: string[] = [];
      collectPathDiffs(pg[id], wb[id], '', pathDiffs, maxDiffs);
      entities.push({
        id,
        status: 'differ',
        summary: summarize(pg[id], wb[id]),
        pathDiffs,
      });
    }
  }

  const report: Report = {
    lang,
    pgFile: path.join(pgDir, lang === 'fr' ? 'entities-fr.json' : 'entities-de.json'),
    wbFile: path.join(wbDir, lang === 'fr' ? 'entities-fr.json' : 'entities-de.json'),
    comparedAt: new Date().toISOString(),
    totals: {
      compared: entities.length,
      equal: entities.filter((e) => e.status === 'equal').length,
      differ: entities.filter((e) => e.status === 'differ').length,
      onlyPg: entities.filter((e) => e.status === 'onlyPg').length,
      onlyWb: entities.filter((e) => e.status === 'onlyWb').length,
    },
    entities,
  };

  console.log(
    `Parallel-diff ${lang}: compared=${report.totals.compared} equal=${report.totals.equal} differ=${report.totals.differ} onlyPg=${report.totals.onlyPg} onlyWb=${report.totals.onlyWb}`
  );
  const differing = entities.filter((e) => e.status === 'differ').slice(0, 20);
  for (const e of differing) {
    console.log(`  DIFF ${e.id}`, e.summary ?? {});
  }

  const outDir = arg('out');
  if (outDir) {
    fs.mkdirSync(outDir, { recursive: true });
    const jsonPath = path.join(outDir, `parallel-diff-report-${lang}.json`);
    const mdPath = path.join(outDir, `parallel-diff-report-${lang}.md`);
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
    fs.writeFileSync(mdPath, toMarkdown(report), 'utf8');
    console.log('Wrote', mdPath);
    console.log('Wrote', jsonPath);
  }

  if (report.totals.differ > 0 || report.totals.onlyPg > 0) {
    process.exitCode = 2;
  }
};

main();
