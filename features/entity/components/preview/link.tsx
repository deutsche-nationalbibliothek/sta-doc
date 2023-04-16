import { useNamespace } from '@/hooks/use-namespace';
import { Namespace, namespaceToColor } from '@/types/namespace';
import { EntityId } from '@/types/entity-id';
import { Tag, Typography } from 'antd';
import { EntityPreview } from '.';
import namespaceConfig from 'config/namespace';
import { Link } from '@/lib/next-link';
import { QueryHighlighter } from '@/lib/highlighter';
import { LinkProps } from 'next/link';

interface EntityLinkProps {
  label: string;
  id: EntityId;
  namespace?: Namespace;
  children?: JSX.Element | JSX.Element[] | string | string[];
  linkProps?: Omit<LinkProps, 'href' | 'style'>;
}

export const EntityLink: React.FC<EntityLinkProps> = ({
  id,
  label,
  namespace: pointingNamespace,
  children,
  linkProps,
}) => {
  const { namespace: currentNamespace } = useNamespace();
  const isPointingDifferentNamespace =
    pointingNamespace && currentNamespace !== pointingNamespace;

  return (
    <Typography.Text>
      <EntityPreview entityId={id} label={label}>
        <Link
          {...linkProps}
          css={{
            alignItems: 'center',
            display: 'flex',
            width: 'fit-content',
          }}
          href={`/entities/${id}`}
        >
          {children ?? <QueryHighlighter textToHighlight={label} />}
          {isPointingDifferentNamespace &&
            !namespaceConfig.notPointedOut.includes(pointingNamespace) && (
              <>
                {' '}
                <Tag
                  css={{
                    backgroundColor:
                      namespaceConfig.colors[
                        namespaceToColor(pointingNamespace)
                      ].primary,
                    opacity: '0.6',
                  }}
                >
                  {pointingNamespace}
                </Tag>
              </>
            )}{' '}
        </Link>
      </EntityPreview>
    </Typography.Text>
  );
};
