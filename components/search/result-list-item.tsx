import { StringValueComponent } from '@/entity/components/values/string';
import { QueryHighlighter } from '@/lib/highlighter';
import { Link } from '@/lib/next-link';
import { Doc, DocSearchKey } from '@/types/search';
import { compact } from 'lodash';
import { NamespaceThemeConfigProvider } from '../namespace-theme-config-provider';
import { Typography } from 'antd';

interface SearchResultListItemProps {
  doc: Doc;
  matchedValue: string;
  isHeadlineTextSearchMatch?: boolean;
  isFullTextSearchMatch?: boolean;
  onCloseDrawer?: () => void;
}

export const SearchResultListItem: React.FC<SearchResultListItemProps> = ({
  doc,
  matchedValue,
  isHeadlineTextSearchMatch,
  isFullTextSearchMatch,
  onCloseDrawer,
}) => {
  if (isHeadlineTextSearchMatch) {
    const matchedHeadlineKeys = Object.keys(doc).filter((key) =>
      /\.headline.title/.test(key)
    );

    const namespace = doc.namespace[0];

    const headlineMatch: { value: string; id: string }[] = compact(
      matchedHeadlineKeys.map((key: DocSearchKey) => {
        if (key in doc && Array.isArray(doc[key])) {
          const docAtKey = doc[key] as string[];
          const index = docAtKey.findIndex(
            (docValue: string) => docValue === matchedValue
          );
          const keyMatch = key.match(/.*(?=\.title)/);
          const keyPrefix = keyMatch && keyMatch[0];
          const docKeyValue =
            keyPrefix && doc[`${keyPrefix}.key` as DocSearchKey];
          if (docKeyValue && key in doc && docAtKey[index]) {
            return {
              value: docAtKey[index],
              id: docKeyValue[index],
            };
          }
        }
      })
    );
    <NamespaceThemeConfigProvider
      namespace={namespace}
    ></NamespaceThemeConfigProvider>;

    return (
      <>
        {headlineMatch.length && (
          <Typography.Paragraph>
            <Link
              onClick={onCloseDrawer}
              href={doc.id == 'Q10177' ? `/` : `/${doc.staNotationLabel[0]}`}
              anchor={headlineMatch[0].id}
            >
              <QueryHighlighter textToHighlight={headlineMatch[0].value} />
            </Link>
          </Typography.Paragraph>
        )}
      </>
    );
  } else if (isFullTextSearchMatch) {
    return (
      <>
        <StringValueComponent stringValue={{ value: matchedValue }} />
      </>
    );
  } else {
    return <></>;
  }
};
