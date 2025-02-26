import { useSearchQueryParams } from '@/hooks/search-query-params-provider';
import { theme } from 'antd';
import { compact } from 'lodash';
import Highlighter from 'react-highlight-words';

interface HighlighterProps {
  searchWords: string[];
  textToHighlight: string;
}

export const MyHighlighter: React.FC<HighlighterProps> = ({
  searchWords,
  textToHighlight,
}) => {
  const { token } = theme.useToken();
  return (
      <Highlighter
        highlightStyle={{
          backgroundColor: token.colorPrimaryBgHover,
          padding: 0,
        }}
        searchWords={searchWords}
        autoEscape
        textToHighlight={textToHighlight}
      />
  );
};

export const QueryHighlighter: React.FC<{ textToHighlight: string }> = ({
  textToHighlight,
}) => {
  const { searchQuery } = useSearchQueryParams();

  return (
    <MyHighlighter
      searchWords={compact([searchQuery.replace(/"+/g, '')])}
      textToHighlight={textToHighlight}
    />
  );
};
