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
  const {searchQueryParamsString} = useSearchQueryParams()

  return (
    <NextLink
      // shallow={true} // todo, set true if entiyid is the same as right now
      href={
        href.toString() + '?' + fetchingQueryParamsString + '&' + searchQueryParamsString + (anchor ? `#${anchor}` : '')
      }
      {...nextLinkProps}
    >
      {children}
    </NextLink>
  );
};
