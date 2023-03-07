import { useNamespace } from '@/hooks/use-namespace';
import { Namespace } from '@/types/namespace';
import { EntityId } from '@/types/entity-id';
import { Tag } from 'antd';
import { EntityPreview } from '.';
import namespaceConfig from 'config/namespace';
import { Link } from '@/lib/next-link';
import { QueryHighlighter } from '@/lib/highlighter';

interface EntityLinkProps {
  label: string;
  id: EntityId;
  namespace?: Namespace;
  children?: JSX.Element | JSX.Element[] | string | string[];
}

export const EntityLink: React.FC<EntityLinkProps> = ({
  id,
  label,
  namespace: pointingNamespace,
  children,
}) => {
  const { namespace: currentNamespace } = useNamespace();
  const isPointingDifferentNamespace =
    pointingNamespace && currentNamespace !== pointingNamespace;

  return (
    <>
      <EntityPreview entityId={id} label={label}>
        <Link
          style={{
            alignItems: 'center',
            display: 'flex',
            width: 'fit-content',
          }}
          href={`/entities/${id}`}
        >
          {children ?? (

        <QueryHighlighter
          textToHighlight={label}
        />
          )}
          {isPointingDifferentNamespace &&
            !namespaceConfig.notPointedOut.includes(pointingNamespace) && (
              <>
                {' '}
                <Tag>{pointingNamespace}</Tag>
              </>
            )}{' '}
        </Link>
      </EntityPreview>
    </>
  );
};
