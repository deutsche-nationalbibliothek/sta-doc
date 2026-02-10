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
import { useRouter } from 'next/router';

interface EntityLinkProps {
  id: EntityId;
  children?: JSX.Element | JSX.Element[] | string | string[];
  label?: string;
  linkProps?: Omit<LinkProps, 'href' | 'style'>;
  locale?: string;
  namespace?: Namespace;
  tooltipPlacement?: TooltipPlacement;
  staNotationLabel?: string;
}

export const EntityLink: React.FC<EntityLinkProps> = ({
  id,
  label,
  locale: propLocale,
  namespace: pointingNamespace,
  staNotationLabel,
  children,
  linkProps,
  tooltipPlacement,
}) => {
  // console.log('record',id,label,propLocale,pointingNamespace,staNotationLabel,children)
  const router = useRouter();
  const locale = propLocale || router.locale || 'de';
  const { namespace: currentNamespace } = useNamespace();
  const { token } = theme.useToken();

  const isPointingDifferentNamespace =
    pointingNamespace && currentNamespace !== pointingNamespace;

  const content = (
    <>
      {children ?? <QueryHighlighter textToHighlight={label || 'No value'} />}
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
        )}{''}
    </>
  );

  return (
    <EntityPreview
      tooltipPlacement={tooltipPlacement}
      entityId={id}
      label={label || 'No value'}
      showPopover={!!staNotationLabel}
    >
      {staNotationLabel || id ? (
        <Link
          {...linkProps}
          css={{
            alignItems: 'center',
            width: 'fit-content',
            '&:hover': {
              color: `${token.colorPrimary} !important`,
            },
          }}
          href={staNotationLabel ? `/${staNotationLabel}` : `/${id}`}
          locale={locale}
        >
          {content}
        </Link>
      ) : (
        <>{content}</>
      )}
    </EntityPreview>
  );
};
