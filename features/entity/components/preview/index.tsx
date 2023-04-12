import { Popover, Typography } from 'antd';
import { FetchEntity } from '../utils/fetch';
import { EntityPreviewContent } from './content';

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
      content={<PreviewFetcher entityId={entityId} />}
      trigger="hover"
    >
      {children}
    </Popover>
  );
};

interface PreviewProps {
  entityId: string;
}

export const PreviewFetcher: React.FC<PreviewProps> = ({ entityId }) => {
  return (
    <FetchEntity entityId={entityId}>
      {({ entity }) => (
        <div
        // style={{
        //   maxWidth: Math.min(window.innerWidth, 960),
        //   maxHeight: Math.min(window.innerHeight, 480),
        // }}
        >
          <EntityPreviewContent entity={entity} />
        </div>
      )}
    </FetchEntity>
  );
};
