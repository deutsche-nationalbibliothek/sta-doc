import { Popover, Typography } from 'antd';
import { EntityDetails } from './details';
import { FetchEntity } from './utils/fetch';

interface EntityPreviewProps {
  entityId: string;
  children: JSX.Element;
  label: string;
}

export const EntityPreview: React.FC<EntityPreviewProps> = ({
  entityId,
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
      {children}
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
