import { Collapse } from '@/components/collapse';
import { Entity } from '@/types/parsed/entity';
import { EntityDetails } from './details';
import { NamespaceThemeConfigProvider } from '@/components/namespace-theme-config-provider';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { theme } from 'antd';
import { Tooltip } from 'antd';
import { memo } from 'react';
import { ExternalLink } from '@/components/external-link';

interface EmbeddedProps {
  entity: Entity;
}

export const Embedded: React.FC<EmbeddedProps> = memo(
  ({ entity }) => {
  const websideUrl = process.env.NEXT_PUBLIC_URL as string;
  const { token } = theme.useToken();
    return (
      <NamespaceThemeConfigProvider namespace={entity.namespace}>
        <Collapse
          defaultOpen={entity.contextOfUseLabel ? false : true}
          labelOpen={entity.contextOfUseLabel}
          labelClosed={entity.contextOfUseLabel}
          extra={
            <>
              {entity.contextOfUseLabel ? (
                <Tooltip title="Anwendungskontext">
                  <PlusCircleOutlined />
                </Tooltip>
              ) : undefined}
              {websideUrl === 'https://edit.sta.dnb.de' ? (
                <ExternalLink
                  css={{
                    color: `${token.colorText} !important`,
                    float: 'right',
                    paddingRight: '3px'
                  }}
                  linkProps={{
                    href: `${websideUrl}/entity/${entity.id}`,
                  }}
                >
                  <>
                    {' '}
                    <EditOutlined />
                  </>
                </ExternalLink>
              ) : undefined}
            </>
          }
        >
          <EntityDetails embedded entity={entity} />
        </Collapse>
      </NamespaceThemeConfigProvider>
    );
  },
  (prevProps, nextProps) => prevProps.entity.id === nextProps.entity.id
);
