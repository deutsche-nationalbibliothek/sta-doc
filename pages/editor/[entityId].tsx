import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { EditorLayout } from '@/features/editor/components/editor-layout';
import { EntityEditor } from '@/features/editor/components/entity-editor';
import { LoadingIndicator } from '@/components/loading-indicator';
import { Typography, Alert } from 'antd';

const { Title } = Typography;

export default function EditorPage() {
  const router = useRouter();
  const { entityId } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prüfen ob Editor aktiviert ist
    if (process.env.NEXT_PUBLIC_EDITOR_ENABLED !== 'true') {
      setError('Editor ist nicht aktiviert');
      setLoading(false);
      return;
    }

    // Prüfen ob entityId vorhanden ist
    if (!entityId || typeof entityId !== 'string') {
      setError('Keine gültige Entity-ID gefunden');
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [entityId]);

  if (loading) {
    return (
      <EditorLayout>
        <LoadingIndicator />
      </EditorLayout>
    );
  }

  if (error) {
    return (
      <EditorLayout>
        <Alert
          message="Fehler"
          description={error}
          type="error"
          showIcon
        />
      </EditorLayout>
    );
  }

  return (
    <EditorLayout>
      <div style={{ padding: '20px' }}>
        <Title level={2}>Entity Editor</Title>
        <Title level={4} type="secondary">
          Entity ID: {entityId}
        </Title>
        <EntityEditor entityId={entityId as string} />
      </div>
    </EditorLayout>
  );
}
