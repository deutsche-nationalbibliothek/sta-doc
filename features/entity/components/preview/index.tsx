import { Popover, Typography } from 'antd';
import { FetchEntity } from '../utils/fetch';
import { EntityPreviewContent } from './content';
import type { TooltipPlacement } from 'antd/lib/tooltip';

interface EntityPreviewProps {
  entityId: string;
  children: JSX.Element;
  label: string;
  showPopover?: boolean;
  tooltipPlacement?: TooltipPlacement;
}

export const EntityPreview: React.FC<EntityPreviewProps> = ({
  entityId,
  children,
  label,
  showPopover = true,
  tooltipPlacement = 'bottom',
}) => {
  return showPopover ? (
    <Popover
      placement={tooltipPlacement}
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
      <FetchEntity entityId={entityId} ignoreFetchingQueryParamString={true}>
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
