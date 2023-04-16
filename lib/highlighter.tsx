import { useSearchQueryParams } from '@/hooks/search-query-params-provider';
import { theme } from 'antd';
import { compact } from 'lodash';
import ReactHighlighter from 'react-highlight-words';

interface HighlighterProps {
  searchWords: string[];
  textToHighlight: string;
}

export const Highlighter: React.FC<HighlighterProps> = ({
  searchWords,
  textToHighlight,
}) => {
  const { token } = theme.useToken();
  return (
    <ReactHighlighter
      highlightStyle={{ backgroundColor: token.colorPrimaryHover, padding: 0 }}
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
    <Highlighter
      searchWords={compact([searchQuery])}
      textToHighlight={textToHighlight}
    />
  );
};
