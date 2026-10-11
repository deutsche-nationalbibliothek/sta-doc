import { Alert, Button } from 'antd';
import { Link } from '@/lib/next-link';
import useTranslation from 'next-translate/useTranslation';
import { ReadStageParam } from '@/hooks/fetch-query-params-provider';

interface DraftPreviewBannerProps {
  entityId: string;
  stage: ReadStageParam;
}

const stageLabels: Record<ReadStageParam, { de: string; fr: string }> = {
  working: {
    de: 'Entwurfsvorschau (Working Copy)',
    fr: 'Aperçu du brouillon (Working Copy)',
  },
  preview: {
    de: 'Preview-Release',
    fr: 'Release preview',
  },
  live: {
    de: 'Live-Release (PostgreSQL)',
    fr: 'Release live (PostgreSQL)',
  },
};

/**
 * Shown when ?stage= is set on an entity view page (Sprint 1½).
 * Full View rendering from Postgres follows via StaContent → EntityEntry mapping.
 */
export const DraftPreviewBanner: React.FC<DraftPreviewBannerProps> = ({
  entityId,
  stage,
}) => {
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';
  const title = isDe ? stageLabels[stage].de : stageLabels[stage].fr;

  return (
    <Alert
      type="warning"
      showIcon
      message={title}
      description={
        isDe
          ? 'Inhalt aus PostgreSQL (Entwurf) — nicht veröffentlicht.'
          : 'Contenu depuis PostgreSQL (brouillon) — non publié.'
      }
      action={
        stage === 'working' ? (
          <Link query={{ edit: '1', stage: 'working' }}>
            <Button size="small" type="primary">
              {isDe ? 'Entwurf bearbeiten' : 'Modifier le brouillon'}
            </Button>
          </Link>
        ) : undefined
      }
      css={{ marginBottom: '1rem' }}
    />
  );
};
