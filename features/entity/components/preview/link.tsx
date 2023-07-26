import { useNamespace } from '@/hooks/use-namespace';
import { QueryHighlighter } from '@/lib/highlighter';
import { Link } from '@/lib/next-link';
import { EntityId } from '@/types/entity-id';
import { Namespace, namespaceToColor } from '@/types/namespace';
import { Tag, theme } from 'antd';
import type { TooltipPlacement } from 'antd/lib/tooltip';
import namespaceConfig from 'config/namespace';
import { LinkProps } from 'next/link';
import { EntityPreview } from '.';

interface EntityLinkProps {
  label: string;
  id: EntityId;
  namespace?: Namespace;
  staNotationLabel?: string;
  children?: JSX.Element | JSX.Element[] | string | string[];
  linkProps?: Omit<LinkProps, 'href' | 'style'>;
  tooltipPlacement?: TooltipPlacement;
}

export const EntityLink: React.FC<EntityLinkProps> = ({
  id,
  label,
  namespace: pointingNamespace,
  staNotationLabel,
  children,
  linkProps,
  tooltipPlacement,
}) => {
  const { namespace: currentNamespace } = useNamespace();
  const { token } = theme.useToken();

  const isPointingDifferentNamespace =
    pointingNamespace && currentNamespace !== pointingNamespace;

  const content = (
    <>
      {children ?? <QueryHighlighter textToHighlight={label} />}
      {isPointingDifferentNamespace &&
        !namespaceConfig.notPointedOut.includes(pointingNamespace) && (
          <>
            <Tag
              css={{
                marginLeft: '0.3em',
                borderColor:
                  namespaceConfig.colors[namespaceToColor(pointingNamespace)]
                    .primary,
              }}
            >
              {pointingNamespace}
            </Tag>
          </>
        )}{' '}
    </>
  );

  return (
    <EntityPreview
      tooltipPlacement={tooltipPlacement}
      entityId={id}
      label={label}
      showPopover={!!staNotationLabel}
    >
      {staNotationLabel ? (
        <Link
          {...linkProps}
          css={{
            alignItems: 'center',
            width: 'fit-content',
            '&:hover': {
              color: `${token.colorPrimary} !important`,
            },
          }}
          href={`/${staNotationLabel}`}
        >
          {content}
        </Link>
      ) : (
        <>{content}</>
      )}
    </EntityPreview>
  );
};
