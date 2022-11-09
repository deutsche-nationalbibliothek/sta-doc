import { useSWR } from '@/lib/swr';
import { Entity } from '@/types/entity';
import { Popover, Spin, Typography } from 'antd';
import Link from 'next/link';
import { EntityDetails } from './details';

interface EntityPreviewProps {
  entityId: string;
  link: string;
  children: JSX.Element;
  label: string;
}

export const EntityPreview: React.FC<EntityPreviewProps> = ({
  entityId,
  link,
  children,
  label,
}) => {
  return (
    <Popover
      placement="bottomRight"
      title={<Typography.Text strong>{label}</Typography.Text>}
      content={<PreviewContent entityId={entityId} />}
      trigger="hover"
    >
      <Link href={link}>{children}</Link>
    </Popover>
  );
};
interface PreviewProps {
  entityId: string;
}

const PreviewContent: React.FC<PreviewProps> = ({ entityId }) => {
  const { data, loading } = useSWR<Entity>(`/api/entities/${entityId}`);

  if (loading) {
    return <Spin />;
  }
  return (
    <div
      style={{
        width: 720,
        maxHeight: 480,
        overflowY: 'scroll',
      }}
    >
      <EntityDetails entity={data} embedded headerLevel={4} />
    </div>
  );
};
