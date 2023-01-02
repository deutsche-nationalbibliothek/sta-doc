import { useFetchingQueryParam } from '@/hooks/fetching-query-param-provider';
import NextLink, { LinkProps } from 'next/link';

export const Link: React.FC<
  LinkProps & { children: React.ReactNode; target?: string }
> = (props) => {
  const { children, href, ...nextLinkProps } = props;

  return (
    <NextLink
      href={href.toString() + useFetchingQueryParam()}
      {...nextLinkProps}
    >
      {children}
    </NextLink>
  );
};
