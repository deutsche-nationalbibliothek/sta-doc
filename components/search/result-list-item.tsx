import { StringValueComponent } from '@/entity/components/values/string';
import { Doc } from '@/types/search';
import Link from 'next/link';

interface SearchResultListItemProps {
  doc: Doc;
  matchedValue: string;
  isHeadlineTextSearchMatch?: boolean;
  isFullTextSearchMatch?: boolean;
}

export const SearchResultListItem: React.FC<SearchResultListItemProps> = ({
  doc,
  matchedValue,
  isHeadlineTextSearchMatch,
  isFullTextSearchMatch,
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
        <Link href={`/entities/${doc.id}#${headlineMatch[0].id}`} id={doc.id}>
          {headlineMatch[0].value}
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
