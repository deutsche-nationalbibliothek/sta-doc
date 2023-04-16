import { Title } from '@/components/title';
import { Namespace } from '@/types/namespace';
import { Entity } from '@/types/parsed/entity';
import { Switch, Typography } from 'antd';
import React from 'react';
import { NamespaceImage } from './namespace-image';
import { PageHeader } from '@/components/page-header';

interface EntityPageHeaderProps {
  entity: Entity;
  namespace?: Namespace;
  isRdaRessourceType: boolean;
  view: {
    get: string;
    set: (newValue: string | undefined) => void;
  };
}

export const EntityPageHeader: React.FC<EntityPageHeaderProps> = ({
  entity,
  namespace,
  isRdaRessourceType,
  view,
}) => {
  const isApplicationProfileView = view.get === 'application-profile';

  return (
    <PageHeader
      title={entity.headline && <Title headline={entity.headline} />}
      extra={
        <>
          <div css={{ textAlign: 'center' }}>
            {namespace && <NamespaceImage />}
            {isRdaRessourceType && (
              <span className="no-print">
                <br />
                <Switch
                  title="Anwendungsprofil"
                  checked={isApplicationProfileView}
                  onChange={() =>
                    view.set(
                      isApplicationProfileView
                        ? undefined
                        : 'application-profile'
                    )
                  }
                />
                <Typography.Text strong={isApplicationProfileView}>
                  Anwendungsprofil
                </Typography.Text>
              </span>
            )}
            {entity.staNotationLabel && (
              <>
                <Typography.Paragraph css={{ textAlign: 'center' }}>
                  <Typography.Text strong>Sta Notation:</Typography.Text>
                  <br />
                  <Typography.Text>{entity.staNotationLabel}</Typography.Text>
                </Typography.Paragraph>
              </>
            )}
          </div>
        </>
      }
    />
  );
};
