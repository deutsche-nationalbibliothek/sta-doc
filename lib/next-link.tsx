import { useFetchingQueryParams } from '@/hooks/fetch-query-params-provider';
import { useSearchQueryParams } from '@/hooks/search-query-params-provider';
import { pickBy } from 'lodash';
import NextLink, { LinkProps } from 'next/link';
import { useRouter as useNextRouter } from 'next/router';
import { CSSProperties } from 'react';

export const Link: React.FC<
  Omit<LinkProps, 'href'> & {
    children: React.ReactNode;
    className?: string;
    target?: string;
    anchor?: string;
    style?: CSSProperties;
    pathname?: string;
    query?: Record<string, string>;
    href?: string;
  }
> = (props) => {
  const {
    children,
    href,
    anchor,
    pathname,
    className,
    query = {},
    ...nextLinkProps
  } = props;
  const router = useNextRouter();

  // global query params:
  const { query: fetchingQuery } = useFetchingQueryParams();
  const { query: searchQuery } = useSearchQueryParams();

  const nextPath = href ?? pathname ?? router.pathname;

  return (
    <NextLink
      // shallow={true} // todo, set true if entiyid is the same as right now
      className={className}
      href={{
        pathname: nextPath,
        hash: anchor,
        query: {
          ...pickBy(router.query, (_value, key) => nextPath.includes(key)),
          ...searchQuery,
          ...fetchingQuery,
          ...query,
        },
      }}
      {...nextLinkProps}
    >
      {children}
    </NextLink>
  );
};
