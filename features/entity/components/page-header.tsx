import { Title } from '@/components/title';
import { Entity } from '@/types/parsed/entity';
import { Switch, Typography } from 'antd';
import React from 'react';
import { PageHeader } from '@/components/page-header';
import { useHeadlines } from '@/hooks/headlines';

interface EntityPageHeaderProps {
  entity: Entity;
  showSwitchApplicationProfile: boolean;
  view: {
    get: string;
    set: (newValue: string | undefined) => void;
  };
}

export const EntityPageHeader: React.FC<EntityPageHeaderProps> = ({
  entity,
  showSwitchApplicationProfile,
  view,
}) => {
  const isApplicationProfileView = view.get === 'application-profile';
  const { setShowHeadlines } = useHeadlines();

  return (
    <PageHeader
      title={entity.headline && <Title headline={entity.headline} />}
      extra={
        <>
          <div css={{ textAlign: 'center' }}>
            {showSwitchApplicationProfile && (
              <span className="no-print">
                <br />
                <Switch
                  title="Anwendungsprofil"
                  checked={isApplicationProfileView}
                  onChange={() => {
                    const nextViewParam = isApplicationProfileView
                      ? undefined
                      : 'application-profile';
                    view.set(nextViewParam);
                    setShowHeadlines(!nextViewParam);
                  }}
                />
                <Typography.Text strong={isApplicationProfileView}>
                  Anwendungsprofil
                </Typography.Text>
              </span>
            )}
            {entity.staNotationLabel && (
              <>
                <Typography.Paragraph css={{ marginBottom: 0 }}>
                  <Typography.Text strong>STA-Notation:</Typography.Text>
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
