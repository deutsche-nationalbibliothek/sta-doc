import { Link } from '@/lib/next-link';

interface ExternalLinkProps {
  children: JSX.Element | string;
  className?: string;
  linkProps: Omit<Parameters<typeof Link>[0], 'children'>;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  linkProps,
  className,
  children,
}) => {
  return (
    <Link {...linkProps} legacyBehavior passHref>
      <a className={className} target="_blank" rel="noopener">
        {children}
      </a>
    </Link>
  );
};
