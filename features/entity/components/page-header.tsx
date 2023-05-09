import { Title } from '@/components/title';
import { Entity } from '@/types/parsed/entity';
import { ConfigProvider, Switch, Typography } from 'antd';
import React from 'react';
import { PageHeader } from '@/components/page-header';
import { useHeadlines } from '@/hooks/headlines';
import useIsSmallScreen from '@/hooks/use-is-small-screen';

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

  const isSmallScreen = useIsSmallScreen();

  return (
    <PageHeader
      title={entity.headline && <Title headline={entity.headline} />}
      extra={
        entity.staNotationLabel || showSwitchApplicationProfile ? (
          <>
            <ConfigProvider
              theme={{
                token: {
                  fontSize: isSmallScreen ? 12 : 14,
                },
              }}
            >
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
                      Anwendungs-Profil
                    </Typography.Text>
                  </span>
                )}
                {entity.staNotationLabel && (
                  <>
                    <Typography.Paragraph css={{ marginBottom: 0 }}>
                      <Typography.Text strong>STA-Notation:</Typography.Text>
                      <br />
                      <Typography.Text>
                        {entity.staNotationLabel}
                      </Typography.Text>
                    </Typography.Paragraph>
                  </>
                )}
              </div>
            </ConfigProvider>
          </>
        ) : undefined
      }
    />
  );
};
