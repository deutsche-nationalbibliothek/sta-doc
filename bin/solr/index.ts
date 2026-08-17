import { reader } from '../data/read';
import { DataState } from '../data/utils';
import { EntityId } from '../../types/entity-id';
import { EntitiesEntries } from '../../types/parsed/entity';
import {
  solrAddDocuments,
  solrBaseUrl,
  solrCommit,
  solrDeleteByIds,
  solrListFilenames,
  solrPing,
} from '../../lib/solr/client';
import {
  SOLR_INDEX_LANGS,
  SolrIndexLang,
  batchSerializedDocuments,
  filenamesToDelete,
  isIndexableEntity,
  toSolrDocument,
} from '../../lib/solr/documents';

const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_BATCH_BYTES = 2_000_000;
const DELETE_BATCH_SIZE = 200;

interface IndexOptions {
  entityIds: EntityId[];
  langs: SolrIndexLang[];
  deleteOrphans: boolean;
  batchSize: number;
  batchBytes: number;
}

const printHelp = () => {
  console.log(`Index parsed entities via the Solr HTTP update API.

Usage:
  npm run solr:index -- [options]

Options:
  --entity <id>         Update one entity (both languages unless --lang is set)
  --ids <id,id>         Update selected entities
  --lang de|fr          Limit to one language (default: de and fr)
  --no-delete           Do not remove documents missing from the parsed data
  --batch-size <n>      Max documents per HTTP request (default: ${DEFAULT_BATCH_SIZE})
  --batch-bytes <n>     Max JSON payload size per request (default: ${DEFAULT_BATCH_BYTES})
  --help                Show this help
`);
};

const parseArgs = (argv: string[]): IndexOptions => {
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const getArg = (name: string): string | undefined => {
    const index = argv.indexOf(name);
    return index === -1 ? undefined : argv[index + 1];
  };

  const entity = getArg('--entity');
  const ids = getArg('--ids')
    ?.split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  const lang = getArg('--lang') as SolrIndexLang | undefined;
  const batchSize = Number(getArg('--batch-size') ?? DEFAULT_BATCH_SIZE);
  const batchBytes = Number(getArg('--batch-bytes') ?? DEFAULT_BATCH_BYTES);

  if (lang && !SOLR_INDEX_LANGS.includes(lang)) {
    throw new Error(`Invalid --lang ${lang}. Use de or fr.`);
  }

  const entityIds = [
    ...(entity ? [entity as EntityId] : []),
    ...((ids ?? []) as EntityId[]),
  ];

  return {
    entityIds,
    langs: lang ? [lang] : [...SOLR_INDEX_LANGS],
    deleteOrphans: !argv.includes('--no-delete') && entityIds.length === 0,
    batchSize:
      Number.isFinite(batchSize) && batchSize > 0
        ? batchSize
        : DEFAULT_BATCH_SIZE,
    batchBytes:
      Number.isFinite(batchBytes) && batchBytes > 0
        ? batchBytes
        : DEFAULT_BATCH_BYTES,
  };
};

const loadEntities = (lang: SolrIndexLang): EntitiesEntries =>
  reader[DataState.parsed].entities.all(lang);

const documentsForLang = (
  entities: EntitiesEntries,
  lang: SolrIndexLang,
  entityIds: EntityId[]
) => {
  const ids =
    entityIds.length > 0 ? entityIds : (Object.keys(entities) as EntityId[]);
  const docs = [];

  for (const id of ids) {
    const entry = entities[id];
    if (!entry?.entity) {
      console.warn(`\tSkipping missing ${lang} entity ${id}`);
      continue;
    }
    if (!isIndexableEntity(entry.entity)) {
      console.warn(
        `\tSkipping ${lang} entity ${id} without staNotationLabel`
      );
      continue;
    }
    docs.push(toSolrDocument(entry.entity, lang));
  }

  return docs;
};

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const indexDocuments = async (options: IndexOptions) => {
  const started = Date.now();
  const reachable = await solrPing();
  if (!reachable) {
    throw new Error(
      `Solr collection "entities" is not reachable at ${solrBaseUrl()}. ` +
        'Start Solr and create the collection first (npm run docker:dev:solr:up, then index again).'
    );
  }

  const incremental = options.entityIds.length > 0;
  console.log(
    incremental
      ? `Updating Solr documents for ${options.entityIds.join(', ')} (${options.langs.join(', ')})`
      : `Reindexing Solr from parsed entities (${options.langs.join(', ')})`
  );

  const allDocs = options.langs.flatMap((lang) =>
    documentsForLang(loadEntities(lang), lang, options.entityIds)
  );

  if (allDocs.length === 0) {
    throw new Error('No Solr documents to index.');
  }

  const existing = options.deleteOrphans ? await solrListFilenames() : [];
  const batches = batchSerializedDocuments(
    allDocs.map((doc) => JSON.stringify(doc)),
    options.batchSize,
    options.batchBytes
  );

  for (const [index, batch] of batches.entries()) {
    await solrAddDocuments(batch);
    console.log(`\tPosted batch ${index + 1}/${batches.length}`);
  }
  console.log(`\tIndexed ${allDocs.length} documents`);

  if (options.deleteOrphans) {
    const stale = filenamesToDelete(
      existing,
      allDocs.map((doc) => doc.filename)
    );
    if (stale.length > 0) {
      for (const ids of chunk(stale, DELETE_BATCH_SIZE)) {
        await solrDeleteByIds(ids);
      }
      console.log(`\tRemoved ${stale.length} stale documents`);
    } else {
      console.log('\tNo stale documents to remove');
    }
  }

  await solrCommit();
  console.log(
    `Solr index update finished in ${((Date.now() - started) / 1000).toFixed(1)}s`
  );
};

(async () => {
  try {
    await indexDocuments(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
})();
