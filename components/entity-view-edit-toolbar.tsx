import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import useTranslation from 'next-translate/useTranslation';
import { ReadStageParam } from '@/hooks/fetch-query-params-provider';
import { useQueryParam } from 'use-query-params';

interface EntityViewEditToolbarProps {
  editMode: boolean;
  stage?: ReadStageParam;
}

/** Shown in edit mode on the entity page (Sprint 1½ View/Edit on same URL). */
export const EntityViewEditToolbar: React.FC<EntityViewEditToolbarProps> = ({
  editMode,
  stage,
}) => {
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';
  const [, setEdit] = useQueryParam('edit');
  const [, setStage] = useQueryParam('stage');

  if (!editMode) {
    return null;
  }

  return (
    <div className="no-print" css={{ marginBottom: '1rem' }}>
      <Button
        icon={<EyeOutlined />}
        size="small"
        onClick={() => {
          setEdit(undefined);
          setStage(stage ?? 'working');
        }}
      >
        {isDe ? 'Zur Ansicht' : 'Voir'}
      </Button>
    </div>
  );
};
