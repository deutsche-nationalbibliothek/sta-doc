import { Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import useTranslation from 'next-translate/useTranslation';
import { ReadStageParam } from '@/hooks/fetch-query-params-provider';
import { useExitEditMode } from '@/hooks/use-exit-edit-mode';
import { RemoveFromDraftButton } from '@/features/editor/remove-from-draft-button';
import { useAuth } from '@/hooks/use-auth';

interface EntityViewEditToolbarProps {
  editMode: boolean;
  stage?: ReadStageParam;
  entityId?: string;
  staNotationLabel?: string;
}

/** Shown in edit mode on the entity page (Sprint 1½ View/Edit on same URL). */
export const EntityViewEditToolbar: React.FC<EntityViewEditToolbarProps> = ({
  editMode,
  stage,
  entityId,
  staNotationLabel,
}) => {
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';
  const exitEditMode = useExitEditMode(stage);
  const { hasRole } = useAuth();
  const showRemove =
    entityId && hasRole('REDAKTEUR') && (stage === 'working' || stage === undefined);

  if (!editMode) {
    return null;
  }

  return (
    <div className="no-print" css={{ marginBottom: '1rem' }}>
      <Space wrap>
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={exitEditMode}
        >
          {isDe ? 'Zur Ansicht' : 'Voir'}
        </Button>
        {showRemove ? (
          <RemoveFromDraftButton
            entityId={entityId}
            staNotationLabel={staNotationLabel}
          />
        ) : null}
      </Space>
    </div>
  );
};
