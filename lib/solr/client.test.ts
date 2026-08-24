import { solrHostCandidates } from './client';

describe('solr host candidates', () => {
  const originalHost = process.env.SOLR_HOST;
  const originalSolrHost = process.env.solrHost;

  afterEach(() => {
    if (originalHost === undefined) {
      delete process.env.SOLR_HOST;
    } else {
      process.env.SOLR_HOST = originalHost;
    }
    if (originalSolrHost === undefined) {
      delete process.env.solrHost;
    } else {
      process.env.solrHost = originalSolrHost;
    }
  });

  it('always includes localhost as a host-side fallback', () => {
    process.env.SOLR_HOST = 'solr';
    delete process.env.solrHost;
    expect(solrHostCandidates()).toEqual(['solr', 'localhost']);
  });

  it('does not duplicate localhost', () => {
    process.env.SOLR_HOST = 'localhost';
    delete process.env.solrHost;
    expect(solrHostCandidates()).toEqual(['localhost']);
  });
});
