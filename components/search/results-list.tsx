import { EntityLink } from '@/entity/components/preview/link';
import { QueryResult } from '@/types/search';
import { List, Card, Typography } from 'antd';
import { uniq } from 'lodash';
import { SearchResultListItem } from './result-list-item';

interface SearchResultsProps {
  queryResult: QueryResult;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  query: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  queryResult,
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
            queryResult && (
              <>
                {queryResult.response.start + 1} -{' '}
                {Math.min(
                  queryResult.response.start + 10,
                  queryResult.response.numFound
                )}{' '}
                von {queryResult.response.numFound} Treffer
              </>
            )
          }
          pagination={
            !loading && {
              position: 'bottom',
              pageSize: 10,
              current: currentPage,
              total: queryResult?.response.numFound,
              showSizeChanger: false,
              onChange: (nextPage) => {
                setCurrentPage(nextPage);
              },
            }
          }
        >
          {queryResult?.response.docs.map((doc, index) => {
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
                    (matchedValue, index2) => (
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
