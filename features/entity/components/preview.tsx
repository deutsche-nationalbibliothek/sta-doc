import { Popover, Typography } from 'antd';
import Link from 'next/link';
import { EntityDetails } from './details';
import { FetchEntity } from './utils/fetch';

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
  return (
    <FetchEntity entityId={entityId}>
      {(entity) => (
        <div
          style={{
            maxWidth: Math.min(window.innerWidth, 960),
            maxHeight: 480,
            overflowY: 'scroll',
          }}
        >
          <EntityDetails entity={entity} embedded />
        </div>
      )}
    </FetchEntity>
  );
};
