import { Collapse } from '@/components/collapse';
import { Entity } from '@/types/parsed/entity';
import { EntityDetails } from './details';
import { NamespaceThemeConfigProvider } from '@/components/namespace-theme-config-provider';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { memo } from 'react';

interface EmbeddedProps {
  entity: Entity;
}

export const Embedded: React.FC<EmbeddedProps> = memo(
  ({ entity }) => {
    return (
      <NamespaceThemeConfigProvider namespace={entity.namespace}>
        <Collapse
          defaultOpen={entity.contextOfUseLabel ? false : true}
          labelOpen={entity.contextOfUseLabel}
          labelClosed={entity.contextOfUseLabel}
          extra={
            entity.contextOfUseLabel ? (
              <Tooltip title="Anwendungskontext">
                <PlusCircleOutlined />
              </Tooltip>
            ) : undefined
          }
        >
          <EntityDetails embedded entity={entity} />
        </Collapse>
      </NamespaceThemeConfigProvider>
    );
  },
  (prevProps, nextProps) => prevProps.entity.id === nextProps.entity.id
);
