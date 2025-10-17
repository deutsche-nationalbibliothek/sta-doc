import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Space, Alert, Typography } from 'antd';
import { useEditorState } from '../hooks/use-editor-state';
import { StaContentCreateRequest } from '../types/editor';

const { Title } = Typography;
const { TextArea } = Input;

export const NewEntityEditor: React.FC = () => {
  const { createEntity, isSaving } = useEditorState();
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: StaContentCreateRequest) => {
    try {
      setError(null);
      await createEntity(values);
      // Success - entity will be loaded automatically
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

  const handleReset = () => {
    form.resetFields();
    setError(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={3}>Neue Entity erstellen</Title>
        
        {error && (
          <Alert
            message="Fehler beim Erstellen"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            language: 'de',
            staType: '',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              label="Titel"
              name="title"
              rules={[
                { required: true, message: 'Titel ist erforderlich' },
                { min: 3, message: 'Titel muss mindestens 3 Zeichen lang sein' },
              ]}
            >
              <Input placeholder="Entity-Titel eingeben" />
            </Form.Item>

            <Form.Item
              label="Sprache"
              name="language"
              rules={[{ required: true, message: 'Sprache ist erforderlich' }]}
            >
              <Select>
                <Select.Option value="de">Deutsch</Select.Option>
                <Select.Option value="fr">Français</Select.Option>
                <Select.Option value="en">English</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="STA Type"
              name="staType"
              rules={[
                { required: true, message: 'STA Type ist erforderlich' },
                { min: 2, message: 'STA Type muss mindestens 2 Zeichen lang sein' },
              ]}
            >
              <Input placeholder="z.B. Person, Werk, Ort" />
            </Form.Item>

            <Form.Item
              label="STA Namespace"
              name="staNamespace"
            >
              <Input placeholder="Namespace (optional)" />
            </Form.Item>
          </div>

          <Form.Item
            label="Quelleninformationen"
            name="sourceInfo"
          >
            <TextArea
              rows={3}
              placeholder="Quelleninformationen (optional)"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSaving}
              >
                Entity erstellen
              </Button>
              <Button onClick={handleReset}>
                Zurücksetzen
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card style={{ marginTop: '16px' }}>
        <Title level={4}>Hinweise</Title>
        <ul>
          <li>Der Titel sollte eindeutig und beschreibend sein</li>
          <li>Der STA Type bestimmt die Kategorie der Entity</li>
          <li>Nach der Erstellung können Sie Statements hinzufügen</li>
          <li>Alle Felder außer Titel, Sprache und STA Type sind optional</li>
        </ul>
      </Card>
    </div>
  );
};
