import { Link } from '@/lib/next-link';
import { ReactNode } from 'react';

interface ExternalLinkProps {
  children: ReactNode;
  className?: string;
  linkProps: Omit<Parameters<typeof Link>[0], 'children'>;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  linkProps,
  className,
  children,
}) => {
  return (
    <a
      className={className}
      target="_blank"
      rel="noopener"
      href={linkProps.href}
    >
      {children}
    </a>
  );
};
