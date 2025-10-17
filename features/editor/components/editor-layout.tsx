import React, { PropsWithChildren } from 'react';
import { Layout as AntdLayout, Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

const { Header, Content } = AntdLayout;
const { Title } = Typography;

interface EditorLayoutProps {
  children: React.ReactNode;
  showToolbar?: boolean;
  onSave?: () => void;
  onUndo?: () => void;
  isDirty?: boolean;
  isSaving?: boolean;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  children,
  showToolbar = true,
  onSave,
  onUndo,
  isDirty = false,
  isSaving = false,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (isDirty) {
      // TODO: Implement confirmation dialog
      const confirmed = window.confirm(
        'Sie haben ungespeicherte Änderungen. Möchten Sie wirklich zurückgehen?'
      );
      if (!confirmed) return;
    }
    router.back();
  };

  return (
    <AntdLayout style={{ minHeight: '100vh' }}>
      {showToolbar && (
        <Header
          style={{
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              type="text"
            >
              Zurück
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              STA Editor
            </Title>
          </Space>

          <Space>
            {onUndo && (
              <Button
                icon={<UndoOutlined />}
                onClick={onUndo}
                disabled={!isDirty}
                type="text"
              >
                Rückgängig
              </Button>
            )}
            {onSave && (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={onSave}
                loading={isSaving}
                disabled={!isDirty}
              >
                Speichern
              </Button>
            )}
          </Space>
        </Header>
      )}

      <Content
        style={{
          background: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Content>
    </AntdLayout>
  );
};
