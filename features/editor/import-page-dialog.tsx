import React, { useState } from 'react';
import { App, Form, Input, Modal } from 'antd';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { importStaContentByIdentifier } from '@/lib/api/editor-client';

interface ImportPageDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ImportPageDialog: React.FC<ImportPageDialogProps> = ({
  open,
  onClose,
}) => {
  const { message } = App.useApp();
  const router = useRouter();
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';
  const [form] = Form.useForm<{ identifier: string }>();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: { identifier: string }) => {
    setSubmitting(true);
    try {
      const result = await importStaContentByIdentifier(values.identifier.trim(), {
        language: isDe ? 'de' : 'fr',
        wb: 'edit',
      });
      if (result.error || !result.data) {
        const parts = [
          result.error?.message,
          result.error?.details,
        ].filter(Boolean);
        message.error(
          parts.length > 0
            ? parts.join(': ')
            : isDe
              ? 'Import fehlgeschlagen'
              : 'Échec de l’import'
        );
        return;
      }
      const { entry, entityId, staNotation, alreadyPresent } = result.data;
      const pathLabel =
        staNotation?.trim() ||
        entry?.staNotation?.trim() ||
        entityId ||
        entry?.entityId;
      if (!pathLabel) {
        message.error(
          isDe
            ? 'Import ohne STA-Notation oder Entity-ID'
            : 'Import sans notation STA ni identifiant'
        );
        return;
      }
      message.success(
        alreadyPresent
          ? isDe
            ? 'Seite bereits in der Working Copy — Editor wird geöffnet'
            : 'Page déjà dans la working copy — ouverture de l’éditeur'
          : isDe
            ? 'Seite aus Wikibase importiert'
            : 'Page importée depuis Wikibase'
      );
      onClose();
      form.resetFields();
      await router.push({
        pathname: `/${encodeURIComponent(pathLabel)}`,
        query: { edit: '1', stage: 'working' },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={isDe ? 'Seite importieren' : 'Importer une page'}
      open={open}
      onCancel={onClose}
      okText={isDe ? 'Importieren' : 'Importer'}
      cancelText={isDe ? 'Abbrechen' : 'Annuler'}
      confirmLoading={submitting}
      destroyOnHidden
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => void onFinish(values)}
      >
        <Form.Item
          name="identifier"
          label={
            isDe ? 'Wikibase-ID oder STA-Notation' : 'ID Wikibase ou notation STA'
          }
          rules={[{ required: true, whitespace: true }]}
          extra={
            isDe
              ? 'Beispiele: P688, RDA-E-K090. Auflösung und Import erfolgen direkt über Wikibase.'
              : 'Exemples : P688, RDA-E-K090. Résolution et import via Wikibase.'
          }
        >
          <Input placeholder={isDe ? 'P688 oder RDA-E-K090' : 'P688 ou RDA-E-K090'} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
