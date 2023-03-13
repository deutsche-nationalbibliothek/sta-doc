import { useFetchingQueryParams } from '@/hooks/fetch-query-params-provider';
import { useSearchQueryParams } from '@/hooks/search-query-params-provider';
import NextLink, { LinkProps } from 'next/link';
import { CSSProperties } from 'react';

export const Link: React.FC<
  LinkProps & {
    children: React.ReactNode;
    target?: string;
    anchor?: string;
    style?: CSSProperties;
  }
> = (props) => {
  const { children, href, anchor, ...nextLinkProps } = props;
  const { fetchingQueryParamsString } = useFetchingQueryParams();
  const { searchQueryParamsString } = useSearchQueryParams();

  const queryParams = [
    fetchingQueryParamsString,
    searchQueryParamsString,
  ].filter((a) => a);

  const queryParamsString = queryParams.length
    ? `?${queryParams.join('&')}`
    : '';

  const anchorString = anchor ? `#${anchor}` : '';

  return (
    <NextLink
      // shallow={true} // todo, set true if entiyid is the same as right now
      href={`${href.toString()}${queryParamsString}${anchorString}`}
      {...nextLinkProps}
    >
      {children}
    </NextLink>
  );
};
