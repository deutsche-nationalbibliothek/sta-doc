import React, { useState } from 'react';
import { Card, Input, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { StaFullStatement, StatementRequest } from '../types/editor';
import { useEditorState } from '../hooks/use-editor-state';

const { Text } = Typography;
const { TextArea } = Input;

interface StatementEditorProps {
  statement: StaFullStatement;
  onDelete: () => void;
}

export const StatementEditor: React.FC<StatementEditorProps> = ({ statement, onDelete }) => {
  const { updateStatement } = useEditorState();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(statement.value);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(statement.value);
  };

  const handleSave = async () => {
    if (editValue === statement.value) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      const request: StatementRequest = {
        propertyKey: statement.property.key,
        value: editValue,
      };
      await updateStatement(statement.id, request);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update statement:', error);
      // Reset to original value on error
      setEditValue(statement.value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(statement.value);
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <Card
      size="small"
      style={{ marginBottom: '8px' }}
      actions={[
        isEditing ? (
          <Space key="save-cancel">
            <Button
              type="text"
              icon={<CheckOutlined />}
              onClick={handleSave}
              loading={isSaving}
              size="small"
            >
              Speichern
            </Button>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCancel}
              disabled={isSaving}
              size="small"
            >
              Abbrechen
            </Button>
          </Space>
        ) : (
          <Space key="edit-delete">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={handleEdit}
              size="small"
            >
              Bearbeiten
            </Button>
            <Popconfirm
              title="Statement löschen"
              description="Sind Sie sicher, dass Sie dieses Statement löschen möchten?"
              onConfirm={handleDelete}
              okText="Ja"
              cancelText="Nein"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                size="small"
              >
                Löschen
              </Button>
            </Popconfirm>
          </Space>
        ),
      ]}
    >
      <div style={{ marginBottom: '8px' }}>
        <Text strong>{statement.property.label}</Text>
        {statement.property.description && (
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {statement.property.description}
            </Text>
          </div>
        )}
      </div>

      {isEditing ? (
        <TextArea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          rows={3}
          placeholder="Statement-Wert eingeben"
          autoFocus
        />
      ) : (
        <div style={{ 
          padding: '8px 12px', 
          background: '#f5f5f5', 
          borderRadius: '4px',
          minHeight: '40px',
          whiteSpace: 'pre-wrap',
        }}>
          {statement.value || <Text type="secondary">Kein Wert</Text>}
        </div>
      )}

      <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
        <Text type="secondary">
          ID: {statement.id} | Property: {statement.property.key}
        </Text>
      </div>
    </Card>
  );
};
