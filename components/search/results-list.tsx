import { EntityLink } from '@/entity/components/preview/link';
import { DocSearchKey, QueryResult } from '@/types/search';
import { List, Card, Typography } from 'antd';
import { compact, uniq } from 'lodash';
import { SearchResultListItem } from './result-list-item';
import { NamespaceThemeConfigProvider } from '../namespace-theme-config-provider';

interface SearchResultsProps {
  queryResult: QueryResult;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  query: string;
  onCloseDrawer?: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  queryResult,
  loading,
  query,
  currentPage,
  setCurrentPage,
  onCloseDrawer,
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
            const headlineMatches = uniq<string>(
              doc['headline-text-search'].filter(
                (docValue: string) =>
                  docValue
                    .toLowerCase()
                    .includes(query.toLowerCase().replace(/"+/g, '')) &&
                  docValue !== doc['headline.title'][0]
              )
            );

            const fulltextMatches: string[] = compact(
              uniq(
                Object.keys(doc).reduce((acc, key: DocSearchKey) => {
                  if (key in doc) {
                    const docValue = doc[key] ?? [];
                    if (Array.isArray(doc[key])) {
                      return [
                        ...acc,
                        ...docValue.filter(
                          (docValue: string) =>
                            docValue !== doc['headline.title'][0] &&
                            headlineMatches.every(
                              (headlineMatch) => headlineMatch !== docValue
                            ) &&
                            docValue
                              .toLowerCase()
                              .includes(query.toLowerCase().replace(/"+/g, ''))
                        ),
                      ];
                    }
                  }
                  return acc;
                }, [] as string[])
              )
            );
            return 'headline-text-search' in doc ? (
              <NamespaceThemeConfigProvider
                key={index}
                namespace={doc.namespace[0]}
              >
                <List.Item style={{ display: 'inherit' }}>
                  <EntityLink
                    tooltipPlacement={'left'}
                    linkProps={{ onClick: onCloseDrawer }}
                    label={`${doc['headline.title'][0]} | ${doc.namespace[0]} / ${doc['pageType.deLabel'][0]}`}
                    staNotationLabel={doc.staNotationLabel.toString()}
                    id={doc.id}
                  />
                  <ul>
                    {headlineMatches.map((matchedValue, index2) => (
                      <li key={index2}>
                        <SearchResultListItem
                          onCloseDrawer={onCloseDrawer}
                          isHeadlineTextSearchMatch
                          doc={doc}
                          matchedValue={matchedValue}
                        />
                      </li>
                    ))}
                    {fulltextMatches.map((matchedValue, index2) => (
                      <li key={index2}>
                        <SearchResultListItem
                          onCloseDrawer={onCloseDrawer}
                          isFullTextSearchMatch
                          doc={doc}
                          matchedValue={matchedValue}
                        />
                      </li>
                    ))}
                  </ul>
                </List.Item>
              </NamespaceThemeConfigProvider>
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
