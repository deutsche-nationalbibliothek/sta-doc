import { useState } from 'react';
import { EditorLayout } from '@/features/editor/components/editor-layout';
import { NewEntityEditor } from '@/features/editor/components/new-entity-editor';
import { LoadingIndicator } from '@/components/loading-indicator';
import { Typography, Alert } from 'antd';

const { Title } = Typography;

export default function NewEntityPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prüfen ob Editor aktiviert ist
  if (process.env.NEXT_PUBLIC_EDITOR_ENABLED !== 'true') {
    return (
      <EditorLayout>
        <Alert
          message="Editor nicht verfügbar"
          description="Der Editor ist nicht aktiviert. Bitte kontaktieren Sie den Administrator."
          type="warning"
          showIcon
        />
      </EditorLayout>
    );
  }

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
        <Title level={2}>Neue Entity erstellen</Title>
        <NewEntityEditor />
      </div>
    </EditorLayout>
  );
}
