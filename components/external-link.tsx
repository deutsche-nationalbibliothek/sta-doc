import { Link } from "@/lib/next-link";

interface ExternalLinkProps {
  href: string;
  children: JSX.Element;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  children,
}) => {
  return (
    <Link href={href} legacyBehavior passHref>
      <a target="_blank" rel="noopener">
        {children}
      </a>
    </Link>
  );
};
