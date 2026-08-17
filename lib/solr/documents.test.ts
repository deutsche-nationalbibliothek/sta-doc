import {
  batchSerializedDocuments,
  filenamesToDelete,
  isIndexableEntity,
  solrFilename,
  toSolrDocument,
} from './documents';
import { Entity } from '@/types/parsed/entity';

const entity = (id: string, staNotationLabel = `STA-${id}`): Entity => ({
  id: id as Entity['id'],
  staNotationLabel,
  statements: { header: [], table: [], body: [] },
});

describe('solr documents', () => {
  it('uses locale-specific filenames as the unique key', () => {
    expect(solrFilename('P18', 'de')).toBe('P18.json');
    expect(solrFilename('P18', 'fr')).toBe('P18-fr.json');
  });

  it('adds filename without dropping the entity id', () => {
    const doc = toSolrDocument(entity('Q2'), 'fr');
    expect(doc.id).toBe('Q2');
    expect(doc.filename).toBe('Q2-fr.json');
    expect(doc.staNotationLabel).toBe('STA-Q2');
  });

  it('indexes only entities that have a staNotationLabel', () => {
    expect(isIndexableEntity(entity('Q2'))).toBe(true);
    expect(isIndexableEntity(entity('Q10177', ''))).toBe(false);
    expect(
      isIndexableEntity({
        ...entity('Q10177', ''),
        staNotationLabel: undefined as unknown as string,
      })
    ).toBe(false);
    expect(isIndexableEntity(entity('Q9', '   '))).toBe(false);
  });

  it('batches by document count and payload size', () => {
    const byCount = batchSerializedDocuments(['{"a":1}', '{"b":2}', '{"c":3}'], 2, 10_000);
    expect(byCount).toEqual(['[{"a":1},{"b":2}]', '[{"c":3}]']);

    const byBytes = batchSerializedDocuments(
      ['{"aaaa":1}', '{"bbbb":2}'],
      50,
      12
    );
    expect(byBytes).toHaveLength(2);
    expect(byBytes[0]).toBe('[{"aaaa":1}]');
    expect(byBytes[1]).toBe('[{"bbbb":2}]');
  });

  it('deletes only filenames that are no longer in the incoming set', () => {
    expect(
      filenamesToDelete(
        ['P1.json', 'P1-fr.json', 'P2.json', 'P9.json'],
        ['P1.json', 'P1-fr.json', 'P2.json']
      )
    ).toEqual(['P9.json']);
  });
});
