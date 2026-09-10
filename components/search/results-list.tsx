import { EntityLink } from '@/entity/components/preview/link';
import { QueryResult } from '@/types/search';
import { List, Card, Typography } from 'antd';
import { SearchResultListItem } from './result-list-item';
import { NamespaceThemeConfigProvider } from '../namespace-theme-config-provider';
import {
  collectSearchSnippets,
  firstStaNotationLabel,
} from './snippets';
import useTranslation from 'next-translate/useTranslation';

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
  const { t } = useTranslation('common');
  
  return (
    <>
      {(queryResult.response.numFound === 0) ? (
              <Card className='search-no-results'>
                <Typography.Paragraph className='search-no-result'>{t('noResults')}</Typography.Paragraph>
              </Card>
            ) : (
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
                {t('searchResultCount', { count: queryResult.response.numFound })}
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
            console.log("index, doc.id:", index, doc.id)
            if (!('headline-text-search' in doc)) {
              return null;
            }

            console.log('before collectSearchSnippets:', doc.id);

            const { staNotationMatch, headlineMatches, fulltextMatches } =
              collectSearchSnippets(doc, query);

            console.log('and after collectSearchSnippets:', doc.id);

            return (
              <NamespaceThemeConfigProvider
                key={index}
                namespace={doc.namespace[0]}
              >
                <List.Item className='search-result' style={{ display: 'inherit' }}>
                  <EntityLink
                    tooltipPlacement={'left'}
                    linkProps={{ onClick: onCloseDrawer }}
                    label={`${doc['headline.title'][0]} | ${doc.namespace[0]} / ${doc['pageType.labelDe'][0]}`}
                    staNotationLabel={firstStaNotationLabel(
                      doc.staNotationLabel
                    )}
                    id={doc.id}
                  />
                  <ul className='search-result-matches'>
                    {staNotationMatch && (
                      <li key="sta-notation" className='search-result-match search-result-match--sta-notation'>
                        <SearchResultListItem
                          onCloseDrawer={onCloseDrawer}
                          isFullTextSearchMatch
                          doc={doc}
                          matchedValue={staNotationMatch}
                        />
                      </li>
                    )}
                    {headlineMatches.map((matchedValue, index2) => (
                      <li key={`headline-${index2}`} className='search-result-match search-result-match--headline'>
                        <SearchResultListItem
                          onCloseDrawer={onCloseDrawer}
                          isHeadlineTextSearchMatch
                          doc={doc}
                          matchedValue={matchedValue}
                        />
                      </li>
                    ))}
                    {fulltextMatches.map((matchedValue, index2) => (
                      <li key={`fulltext-${index2}`} className='search-result-match search-result-match--fulltext'>
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
            ) 
          })}
        </List>
      )}
    </>
  );
};
