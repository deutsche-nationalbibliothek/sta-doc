import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Typography } from 'antd';
import { useEntityLabel } from '../use-entity-label';
import { isEntityId } from './original-language';

export interface EntityIdModalProps {
  open: boolean;
  title: string;
  okText?: string;
  initialId?: string;
  allowPropertyIds?: boolean;
  onCancel: () => void;
  onSubmit: (entityId: string, label?: string) => void;
}

/**
 * Interim entity picker: ID input + Working-Copy label preview.
 * Replace with search once an entity index endpoint exists (Sprint 6).
 */
export const EntityIdModal: React.FC<EntityIdModalProps> = ({
  open,
  title,
  okText = 'Übernehmen',
  initialId = '',
  allowPropertyIds = true,
  onCancel,
  onSubmit,
}) => {
  const [entityId, setEntityId] = useState(initialId);
  const trimmed = entityId.trim();
  const valid =
    isEntityId(trimmed) &&
    (allowPropertyIds || trimmed.toUpperCase().startsWith('Q'));
  const { label, loading } = useEntityLabel(valid ? trimmed : undefined);

  useEffect(() => {
    if (open) {
      setEntityId(initialId);
    }
  }, [open, initialId]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={() => {
        if (!valid) {
          return;
        }
        onSubmit(trimmed, label);
      }}
      okText={okText}
      okButtonProps={{ disabled: !valid }}
      destroyOnHidden
    >
      <Form layout="vertical">
        <Form.Item
          label="Entity-ID"
          required
          help={
            allowPropertyIds
              ? 'Q… (Item) oder P… (Property)'
              : 'Q… (Item)'
          }
        >
          <Input
            value={entityId}
            onChange={(event) => setEntityId(event.target.value)}
            placeholder={allowPropertyIds ? 'Q200 oder P11' : 'Q200'}
            autoFocus
            onPressEnter={() => {
              if (valid) {
                onSubmit(trimmed, label);
              }
            }}
          />
        </Form.Item>
        {valid && (
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {loading
              ? 'Titel wird geladen…'
              : label
                ? `Titel: ${label}`
                : 'Kein Titel in der Working Copy gefunden (ID wird trotzdem übernommen).'}
          </Typography.Paragraph>
        )}
      </Form>
    </Modal>
  );
};
