import { Alert } from 'antd';
import useTranslation from 'next-translate/useTranslation';

/** Shown above the editor when the loaded draft differs from the published release. */
export const DraftPreviewBanner: React.FC = () => {
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';

  return (
    <Alert
      type="warning"
      showIcon
      message={
        isDe
          ? 'Entwurfsvorschau mit bislang unveröffentlichten Änderungen'
          : 'Aperçu du brouillon avec des modifications non publiées'
      }
      css={{ marginBottom: '1rem' }}
    />
  );
};
