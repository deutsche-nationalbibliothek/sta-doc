import { EntityLink } from '@/entity/components/preview/link';
import { QueryResult } from '@/types/search';
import { List, Card, Typography } from 'antd';
import { SearchResultListItem } from './result-list-item';
import { NamespaceThemeConfigProvider } from '../namespace-theme-config-provider';
import {
  collectSearchSnippets,
  firstStaNotationLabel,
} from './snippets';

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
            const { staNotationMatch, headlineMatches, fulltextMatches } =
              collectSearchSnippets(doc, query);

            return 'headline-text-search' in doc ? (
              <NamespaceThemeConfigProvider
                key={index}
                namespace={doc.namespace[0]}
              >
                <List.Item style={{ display: 'inherit' }}>
                  <EntityLink
                    tooltipPlacement={'left'}
                    linkProps={{ onClick: onCloseDrawer }}
                    label={`${doc['headline.title'][0]} | ${doc.namespace[0]} / ${doc['pageType.labelDe'][0]}`}
                    staNotationLabel={firstStaNotationLabel(
                      doc.staNotationLabel
                    )}
                    id={doc.id}
                  />
                  <ul>
                    {staNotationMatch && (
                      <li key="sta-notation">
                        <SearchResultListItem
                          onCloseDrawer={onCloseDrawer}
                          isFullTextSearchMatch
                          doc={doc}
                          matchedValue={staNotationMatch}
                        />
                      </li>
                    )}
                    {headlineMatches.map((matchedValue, index2) => (
                      <li key={`headline-${index2}`}>
                        <SearchResultListItem
                          onCloseDrawer={onCloseDrawer}
                          isHeadlineTextSearchMatch
                          doc={doc}
                          matchedValue={matchedValue}
                        />
                      </li>
                    ))}
                    {fulltextMatches.map((matchedValue, index2) => (
                      <li key={`fulltext-${index2}`}>
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
