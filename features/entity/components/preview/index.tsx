import { Popover, Typography } from 'antd';
import { FetchEntity } from '../utils/fetch';
import { EntityPreviewContent } from './content';

interface EntityPreviewProps {
  entityId: string;
  children: JSX.Element;
  label: string;
  showPopover?: boolean;
}

export const EntityPreview: React.FC<EntityPreviewProps> = ({
  entityId,
  children,
  label,
  showPopover = true,
}) => {
  return showPopover ? (
    <Popover
      placement="bottomRight"
      title={<Typography.Text strong>{label}</Typography.Text>}
      content={<PreviewFetcher entityId={entityId} />}
      mouseEnterDelay={0.3}
      trigger="hover"
    >
      {children}
    </Popover>
  ) : (
    <>{children}</>
  );
};

interface PreviewProps {
  entityId: string;
}

export const PreviewFetcher: React.FC<PreviewProps> = ({ entityId }) => {
  return (
    <div
      css={{
        display: 'grid',
      }}
    >
      <FetchEntity entityId={entityId}>
        {({ entity }) => (
          <div
            css={{
              maxWidth: Math.min(window.innerWidth, 960),
              maxHeight: Math.min(window.innerHeight, 480),
              overflowX: 'auto',
            }}
          >
            <EntityPreviewContent entity={entity} />
          </div>
        )}
      </FetchEntity>
    </div>
  );
};
