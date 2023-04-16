import { QueryHighlighter } from '@/lib/highlighter';
import { Typography } from 'antd';
import { PropsWithStyle } from 'index';

interface StringValueProps {
  stringValue: { value: string };
  code?: boolean;
}

export const StringValueComponent: React.FC<
  PropsWithStyle<StringValueProps>
> = ({ code, className, stringValue }) => {
  const isHtml = (str: string) => {
    // ref: https://stackoverflow.com/a/15458968
    const doc = Array.from(
      new DOMParser().parseFromString(str, 'text/html').body.childNodes
    );
    const hasHtmlNodes = doc.some((node) => node.nodeType === 1);
    // make it work with strings that has only html encodings like: '&nbsp'
    const hasSingleTextWithChangedContent =
      doc.length === 1 && doc[0].nodeType === 3 && doc[0].textContent !== str;

    return hasHtmlNodes || hasSingleTextWithChangedContent;
  };

  return (
    <>
      <Typography.Paragraph className={className} code={code}>
        {isHtml(stringValue.value) ? (
          <span dangerouslySetInnerHTML={{ __html: stringValue.value }} />
        ) : (
          <QueryHighlighter textToHighlight={stringValue.value} />
        )}
      </Typography.Paragraph>{' '}
    </>
  );
};
