import { Entity } from '../../types/parsed/entity';

export type SolrIndexLang = 'de' | 'fr';

export const SOLR_INDEX_LANGS: SolrIndexLang[] = ['de', 'fr'];

/** Matches the uniqueKey produced by the former per-file `bin/post` indexing. */
export const solrFilename = (
  entityId: string,
  lang: SolrIndexLang
): string => (lang === 'fr' ? `${entityId}-fr.json` : `${entityId}.json`);

/** Solr requires staNotationLabel; entities without one are not search documents. */
export const isIndexableEntity = (entity: Entity): boolean =>
  Boolean(entity.staNotationLabel?.trim());

export const toSolrDocument = (
  entity: Entity,
  lang: SolrIndexLang
): Entity & { filename: string } => ({
  ...entity,
  filename: solrFilename(entity.id, lang),
});

export const filenamesToDelete = (
  existing: string[],
  incoming: Iterable<string>
): string[] => {
  const keep = new Set(incoming);
  return existing.filter((filename) => !keep.has(filename));
};

export const batchSerializedDocuments = (
  serializedDocs: string[],
  maxItems: number,
  maxBytes: number
): string[] => {
  const batches: string[] = [];
  let current: string[] = [];
  let bytes = 0;

  for (const doc of serializedDocs) {
    const size = doc.length;
    const wouldExceed =
      current.length > 0 &&
      (current.length >= maxItems || bytes + size > maxBytes);

    if (wouldExceed) {
      batches.push(`[${current.join(',')}]`);
      current = [];
      bytes = 0;
    }

    current.push(doc);
    bytes += size;
  }

  if (current.length > 0) {
    batches.push(`[${current.join(',')}]`);
  }

  return batches;
};
