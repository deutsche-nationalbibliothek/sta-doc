import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useTranslation from 'next-translate/useTranslation';
import { Link } from '@/lib/next-link';
import { useAuth } from '@/hooks/use-auth';
import { useNamespace } from '@/hooks/use-namespace';
import { editorFeatures } from '@/lib/sta-editor-features';
import { ImportPageDialog } from '@/features/editor/import-page-dialog';
import { NewPageDialog } from '@/features/editor/new-page-dialog';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { theme } from 'antd';

/** Horizontal gap between items in the top-bar editor cluster (login, search, locale, …). */
export const topBarEditorClusterGap = (compact: boolean) =>
  compact ? 18 : 28;

/** Wartung + Neue Seite — left of the search icon in the top bar. */
export const TopBarEditorActions: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => {
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';
  const { hasRole } = useAuth();
  const { namespace } = useNamespace();
  const { token } = theme.useToken();
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  if (!editorFeatures.editorEnabled || !hasRole('REDAKTEUR')) {
    return null;
  }

  const linkStyle = {
    color: token.colorText,
    fontSize: compact ? 12 : 14,
    lineHeight: 1.2,
    whiteSpace: 'nowrap' as const,
  };

  return (
    <>
      <span
        css={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: topBarEditorClusterGap(compact),
        }}
      >
        <Link href="/maintenance" title="Wartung" style={linkStyle}>
          Wartung
        </Link>
        <Button
          type="link"
          size={compact ? 'small' : 'middle'}
          icon={<CloudDownloadOutlined />}
          onClick={() => setImportOpen(true)}
          style={{
            ...linkStyle,
            paddingInline: compact ? 4 : 8,
            height: 'auto',
          }}
        >
          {isDe ? 'Seite importieren' : 'Importer une page'}
        </Button>
        <Button
          type="link"
          size={compact ? 'small' : 'middle'}
          icon={<PlusOutlined />}
          onClick={() => setNewPageOpen(true)}
          style={{
            ...linkStyle,
            paddingInline: compact ? 4 : 8,
            height: 'auto',
          }}
        >
          {isDe ? 'Neue Seite' : 'Nouvelle page'}
        </Button>
      </span>
      <ImportPageDialog open={importOpen} onClose={() => setImportOpen(false)} />
      <NewPageDialog
        open={newPageOpen}
        onClose={() => setNewPageOpen(false)}
        defaultNamespace={namespace}
      />
    </>
  );
};
