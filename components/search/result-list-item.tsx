import { StringValueComponent } from '@/entity/components/values/string';
import { QueryHighlighter } from '@/lib/highlighter';
import { Link } from '@/lib/next-link';
import { Doc } from '@/types/search';

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

    const headlineMatch: { value: string; id: string }[] = matchedHeadlineKeys
      .map((key) => {
        const index = doc[key].findIndex(
          (docValue: string) => docValue === matchedValue
        );
        const keyPrefix = key.match(/.*(?=\.title)/)[0];
        if (key in doc && doc[key][index]) {
          return {
            value: doc[key][index],
            id: doc[`${keyPrefix}.key`][index],
          };
        }
      })
      .filter((a) => a);

    return (
      headlineMatch.length && (
        <Link
          onClick={onCloseDrawer}
          href={`/entities/${doc.id}`}
          anchor={headlineMatch[0].id}
        >
          <QueryHighlighter textToHighlight={headlineMatch[0].value} />
        </Link>
      )
    );
  } else if (isFullTextSearchMatch) {
    return (
      <>
        <StringValueComponent stringValue={{ value: matchedValue }} />
      </>
    );
  }
};
