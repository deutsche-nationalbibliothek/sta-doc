import { useNamespace } from '@/hooks/use-namespace';
import { EntityId } from '@/types/entity-id';
import { Tag } from 'antd';
import Link from 'next/link';
import { EntityPreview } from '.';

interface EntityLinkProps {
  label: string;
  id: EntityId;
  elementOf?: EntityId;
  children?: JSX.Element | JSX.Element[] | string | string[];
}

export const EntityLink: React.FC<EntityLinkProps> = ({
  id,
  label,
  elementOf,
  children,
}) => {
  const { namespace: currentNamespace, namespaceByItemId } = useNamespace();
  const pointingNamespace =
    currentNamespace && elementOf && namespaceByItemId(elementOf);
  const isPointingDifferentNamespace =
    pointingNamespace && currentNamespace !== namespaceByItemId(elementOf);

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
          {children ?? label}
          {isPointingDifferentNamespace && (
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
