import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Select, Button, Space, Alert, Spin, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEditorState } from '../hooks/use-editor-state';
import { StatementEditor } from './statement-editor';
import { PropertySelector } from './property-selector';
import { ValidationDisplay } from './validation-display';
import { StaContentCreateRequest, StatementRequest } from '../types/editor';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface EntityEditorProps {
  entityId: string;
}

export const EntityEditor: React.FC<EntityEditorProps> = ({ entityId }) => {
  const {
    entity,
    isLoading,
    isSaving,
    isDirty,
    validationErrors,
    loadEntity,
    saveEntity,
    addStatement,
    deleteStatement,
    validateEntity,
    setMode,
  } = useEditorState();

  const [form] = Form.useForm();
  const [showAddStatement, setShowAddStatement] = useState(false);

  // Load entity on mount
  useEffect(() => {
    if (entityId) {
      loadEntity(entityId);
    }
  }, [entityId, loadEntity]);

  // Update form when entity changes
  useEffect(() => {
    if (entity) {
      form.setFieldsValue({
        title: entity.title,
        language: entity.language,
        staNamespace: entity.staNamespace,
        sourceInfo: entity.sourceInfo,
        staType: entity.staType,
      });
      setMode('edit');
    }
  }, [entity, form, setMode]);

  const handleSave = async () => {
    try {
      await saveEntity();
      // Show success message
    } catch (error) {
      console.error('Save failed:', error);
      // Show error message
    }
  };

  const handleValidate = async () => {
    try {
      await validateEntity();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAddStatement = async (request: StatementRequest) => {
    try {
      await addStatement(request);
      setShowAddStatement(false);
    } catch (error) {
      console.error('Failed to add statement:', error);
    }
  };

  const handleDeleteStatement = async (statementId: string) => {
    try {
      await deleteStatement(statementId);
    } catch (error) {
      console.error('Failed to delete statement:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Lade Entity...</Text>
        </div>
      </div>
    );
  }

  if (!entity) {
    return (
      <Alert
        message="Entity nicht gefunden"
        description="Die angeforderte Entity konnte nicht geladen werden."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Entity Header */}
      <Card style={{ marginBottom: '16px' }}>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={() => {
            // Mark as dirty when form changes
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              label="Titel"
              name="title"
              rules={[{ required: true, message: 'Titel ist erforderlich' }]}
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
              label="STA Namespace"
              name="staNamespace"
            >
              <Input placeholder="Namespace (optional)" />
            </Form.Item>

            <Form.Item
              label="STA Type"
              name="staType"
              rules={[{ required: true, message: 'STA Type ist erforderlich' }]}
            >
              <Input placeholder="STA Type eingeben" />
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
        </Form>
      </Card>

      {/* Validation Errors */}
      {validationErrors && !validationErrors.isValid && (
        <ValidationDisplay validationResult={validationErrors} />
      )}

      {/* Statements */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              Statements ({entity.statements.length})
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowAddStatement(true)}
            >
              Statement hinzufügen
            </Button>
          </div>
        }
      >
        {entity.statements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <Text>Keine Statements vorhanden</Text>
            <br />
            <Text type="secondary">Klicken Sie auf "Statement hinzufügen" um zu beginnen</Text>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {entity.statements.map((statement) => (
              <StatementEditor
                key={statement.id}
                statement={statement}
                onDelete={() => handleDeleteStatement(statement.id)}
              />
            ))}
          </div>
        )}

        {/* Add Statement Form */}
        {showAddStatement && (
          <Card
            size="small"
            style={{ marginTop: '16px', border: '2px dashed #d9d9d9' }}
            title="Neues Statement hinzufügen"
            extra={
              <Button
                size="small"
                onClick={() => setShowAddStatement(false)}
              >
                Abbrechen
              </Button>
            }
          >
            <PropertySelector
              onSubmit={handleAddStatement}
              onCancel={() => setShowAddStatement(false)}
            />
          </Card>
        )}
      </Card>

      {/* Action Buttons */}
      <Card style={{ marginTop: '16px' }}>
        <Space>
          <Button
            type="primary"
            loading={isSaving}
            disabled={!isDirty}
            onClick={handleSave}
          >
            Speichern
          </Button>
          <Button
            onClick={handleValidate}
            disabled={!entity}
          >
            Validieren
          </Button>
          <Button
            disabled={!isDirty}
            onClick={() => {
              // Reset form to original values
              if (entity) {
                form.setFieldsValue({
                  title: entity.title,
                  language: entity.language,
                  staNamespace: entity.staNamespace,
                  sourceInfo: entity.sourceInfo,
                  staType: entity.staType,
                });
              }
            }}
          >
            Zurücksetzen
          </Button>
        </Space>
      </Card>
    </div>
  );
};
