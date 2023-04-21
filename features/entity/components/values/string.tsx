import { QueryHighlighter } from '@/lib/highlighter';
import { Item } from '@/types/item';
import { ItemType } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Typography } from 'antd';
import { PropsWithStyle } from 'index';

interface StringValueProps {
  stringValue: { value: string };
  itemType?: ItemType;
  property?: Property;
}

export const StringValueComponent: React.FC<
  PropsWithStyle<StringValueProps>
> = ({ itemType, property, className, stringValue }) => {
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
      <Typography.Paragraph
        css={{ color: itemType === Item['English-123'] ? 'gray' : 'initial' }}
        className={className}
        code={property === Property.Encoding}
        italic={itemType === Item['italic-(type-of-layout)']}
        strong={itemType === Item['bold-(Type-of-layout)']}
      >
        {isHtml(stringValue.value) ? (
          <span dangerouslySetInnerHTML={{ __html: stringValue.value }} />
        ) : (
          <QueryHighlighter textToHighlight={stringValue.value} />
        )}
      </Typography.Paragraph>{' '}
    </>
  );
};
