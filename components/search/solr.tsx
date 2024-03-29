import { StringValueComponent } from '@/entity/components/values/string';
import { useSolrSearch } from '@/hooks/use-solr-search';
import { debounce } from 'lodash';
import { SearchResults } from './results-list';
import { AutoComplete, ConfigProvider, Input } from 'antd';
import { Namespace } from '@/types/namespace';
import { NamespaceThemeConfigProvider } from '../namespace-theme-config-provider';

export interface SolrQueryFetcherOptions {
  query: string;
}

interface SolrSearchProps {
  placeholder?: string;
  onCloseDrawer?: () => void;
}

export const SolrSearch: React.FC<SolrSearchProps> = ({
  placeholder,
  onCloseDrawer,
}) => {
  const {
    suggestionsResult,
    queryResult,
    inputRef,
    isLoadingSearchIfQuery,
    isLoadingSuggestionsIfQuery,
    setQuery,
    query,
    onSearch,
    currentPage,
    setCurrentPage,
  } = useSolrSearch();

  return (
    <NamespaceThemeConfigProvider namespace={'unspecific' as Namespace}>
      {/* restore fontSize, since TobBar is changing it */}
      <ConfigProvider
        theme={{
          token: {
            fontSize: 14,
          },
        }}
      >
        <AutoComplete
          css={{ width: '100%' }}
          autoFocus
          onSelect={(value: string) =>
            setQuery(value.replaceAll(/(<([^>]+)>)/g, ''))
          }
          defaultValue={query}
          options={
            query && suggestionsResult?.spellcheck.suggestions[1]
              ? suggestionsResult.spellcheck.suggestions[1].suggestion
                  .sort((s1, s2) => s2.freq - s1.freq)
                  .map((x, index) => ({
                    value: x.word,
                    key: index,
                    label: (
                      <StringValueComponent stringValue={{ value: x.word }} />
                    ),
                  }))
              : []
          }
        >
          <Input.Search
            placeholder={placeholder}
            loading={isLoadingSuggestionsIfQuery}
            ref={inputRef}
            autoFocus
            enterButton
            defaultValue={query}
            value={query}
            onChange={debounce(onSearch, 400)}
            allowClear
          />
        </AutoComplete>
        {queryResult && (
          <SearchResults
            queryResult={queryResult}
            loading={isLoadingSearchIfQuery}
            query={query}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onCloseDrawer={onCloseDrawer}
          />
        )}
      </ConfigProvider>
    </NamespaceThemeConfigProvider>
  );
};
