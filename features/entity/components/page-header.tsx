import { Title } from '@/components/title';
import { Entity } from '@/types/parsed/entity';
import { Button, ConfigProvider, Switch, Typography } from 'antd';
import React from 'react';
import { PageHeader } from '@/components/page-header';
import { useHeadlines } from '@/hooks/headlines';
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { useAuth } from '@/hooks/use-auth';
import { EditOutlined } from '@ant-design/icons';
import { Link } from '@/lib/next-link';
import {
  ReadStageParam,
  useFetchingQueryParams,
} from '@/hooks/fetch-query-params-provider';
import { editorFeatures } from '@/lib/sta-editor-features';

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
  const { canEdit, loading: authLoading } = useAuth();
  const { query } = useFetchingQueryParams();

  const isSmallScreen = useIsSmallScreen();

  const editStage: ReadStageParam = query.stage ?? 'working';
  const showEditorUi = editorFeatures.editorEnabled;
  const showEditAction = showEditorUi && !authLoading && canEdit;

  return (
    <PageHeader
      title={entity.headline && <Title headline={entity.headline} />}
      extra={
        entity.staNotationLabel || showSwitchApplicationProfile || showEditAction ? (
          <>
            <ConfigProvider
              theme={{
                token: {
                  fontSize: isSmallScreen ? 12 : 14,
                },
              }}
            >
              <div css={{ textAlign: 'center' }}>
                {showEditAction && (
                  <div className="no-print" css={{ marginBottom: 8 }}>
                    <Link query={{ edit: '1', stage: editStage }}>
                      <Button type="default" icon={<EditOutlined />} size="small">
                        Bearbeiten
                      </Button>
                    </Link>
                  </div>
                )}
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
