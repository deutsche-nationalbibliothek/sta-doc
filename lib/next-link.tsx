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

  const rawHref = href ?? pathname ?? router.asPath.split('#')[0].split('?')[0];
  const hashIndex = rawHref.indexOf('#');
  const nextPath =
    hashIndex >= 0
      ? rawHref.slice(0, hashIndex) ||
        router.asPath.split('#')[0].split('?')[0]
      : rawHref;
  const hrefHash = hashIndex >= 0 ? rawHref.slice(hashIndex + 1) : undefined;

  return (
    <NextLink
      // shallow={true} // todo, set true if entiyid is the same as right now
      className={className}
      href={{
        pathname: nextPath,
        hash: anchor ?? hrefHash ?? '',
        query: props.legacyBehavior
          ? {}
          : {
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
