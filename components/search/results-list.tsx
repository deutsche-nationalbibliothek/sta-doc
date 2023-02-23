import { EntityLink } from '@/entity/components/preview/link';
import { SearchResult } from '@/types/search';
import { List, Card, Typography } from 'antd';
import { uniq } from 'lodash';
import { SearchResultListItem } from './result-list-item';
import { SolrQueryFetcherOptions } from './solr';

interface SearchResultsProps {
  solrQueryFetcher: (opts: SolrQueryFetcherOptions) => void;
  searchResult: SearchResult;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  query: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  solrQueryFetcher,
  searchResult,
  loading,
  query,
  currentPage,
  setCurrentPage,
}) => {
  return (
    <>
      {query && (
        <List
          loading={loading}
          header={
            searchResult && (
              <>
                {searchResult.response.start + 1} -{' '}
                {Math.min(
                  searchResult.response.start + 10,
                  searchResult.response.numFound
                )}{' '}
                von {searchResult.response.numFound} Treffer
              </>
            )
          }
          pagination={
            !loading && {
              position: 'bottom',
              pageSize: 10,
              current: currentPage,
              total: searchResult?.response.numFound,
              showSizeChanger: false,
              onChange: (nextPage, pageSize) => {
                solrQueryFetcher({
                  query,
                  start: (nextPage - 1) * pageSize,
                });
                setCurrentPage(nextPage);
              },
            }
          }
        >
          {searchResult?.response.docs.map((doc,index) => {
            const getFilteredValues = (
              searchKey: string,
              excludeKey?: string
            ) => {
              return uniq<string>(
                doc[searchKey].filter(
                  (docValue: string) =>
                    docValue.includes(query) &&
                    (excludeKey
                      ? !doc[excludeKey].find((docValue: string) =>
                          docValue.includes(query)
                        )
                      : true) &&
                    docValue !== doc['headline.title'][0]
                )
              );
            };

            return 'headline-text-search' in doc ? (
              <List.Item key={index} style={{ display: 'inherit' }}>
                <EntityLink label={doc['headline.title'][0]} id={doc.id} />
                <ul>
                  {getFilteredValues('headline-text-search').map(
                    (matchedValue,index2) => (
                      <li key={index2}>
                        <SearchResultListItem
                          isHeadlineTextSearchMatch
                          doc={doc}
                          matchedValue={matchedValue}
                        />
                      </li>
                    )
                  )}
                  {getFilteredValues(
                    'full-text-search',
                    'headline-text-search'
                  ).map((matchedValue, index2) => (
                    <li key={index2}>
                      <SearchResultListItem
                        isFullTextSearchMatch
                        doc={doc}
                        matchedValue={matchedValue}
                      />
                    </li>
                  ))}
                </ul>
              </List.Item>
            ) : (
              <Card>
                <Typography.Paragraph>Keine Treffer</Typography.Paragraph>
              </Card>
            );
          })}
        </List>
      )}
    </>
  );
};
