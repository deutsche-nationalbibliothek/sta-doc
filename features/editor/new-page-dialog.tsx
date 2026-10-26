import React, { useEffect, useState } from 'react';
import { App, Form, Input, Modal, Select } from 'antd';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { createStaEntity } from '@/lib/api/editor-client';
import {
  NEW_PAGE_NAMESPACE_OPTIONS,
  STA_PAGE_TYPE_OPTIONS,
  resolveNewPageNamespace,
} from '@/lib/api/catalog-types';
import { Namespace } from '@/types/namespace';

interface NewPageDialogProps {
  open: boolean;
  onClose: () => void;
  defaultNamespace?: Namespace;
}

export const NewPageDialog: React.FC<NewPageDialogProps> = ({
  open,
  onClose,
  defaultNamespace,
}) => {
  const { message } = App.useApp();
  const router = useRouter();
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    form.setFieldsValue({
      staNamespace: resolveNewPageNamespace(defaultNamespace),
      staType: STA_PAGE_TYPE_OPTIONS[0]?.value,
    });
  }, [open, defaultNamespace, form]);

  const onFinish = async (values: {
    staType: string;
    title: string;
    staNotation: string;
    staNamespace?: string;
  }) => {
    setSubmitting(true);
    try {
      const result = await createStaEntity({
        staType: values.staType,
        title: values.title.trim(),
        language: isDe ? 'de' : 'fr',
        staNamespace: values.staNamespace,
        staNotation: values.staNotation.trim(),
        role: 'page',
        sourceInfo: 'sta-doc-ui',
      });
      if (result.error) {
        message.error(result.error.message);
        return;
      }
      const notation = result.data?.staNotation ?? values.staNotation.trim();
      message.success(isDe ? 'Seite angelegt' : 'Page créée');
      onClose();
      form.resetFields();
      await router.push({
        pathname: `/${notation}`,
        query: { edit: '1', stage: 'working' },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={isDe ? 'Neue Seite' : 'Nouvelle page'}
      open={open}
      onCancel={onClose}
      okText={isDe ? 'Anlegen' : 'Créer'}
      cancelText={isDe ? 'Abbrechen' : 'Annuler'}
      confirmLoading={submitting}
      destroyOnHidden
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          staNamespace: resolveNewPageNamespace(defaultNamespace),
          staType: STA_PAGE_TYPE_OPTIONS[0]?.value,
        }}
        onFinish={(values) => void onFinish(values)}
      >
        <Form.Item
          name="staType"
          label={isDe ? 'Seitenart' : 'Type de page'}
          rules={[{ required: true }]}
        >
          <Select
            options={STA_PAGE_TYPE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: isDe ? opt.labelDe : opt.labelFr,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="title"
          label={isDe ? 'Titel' : 'Titre'}
          rules={[{ required: true, whitespace: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="staNotation"
          label="STA-Notation"
          rules={[{ required: true, whitespace: true }]}
          extra={
            isDe
              ? 'URL-Pfad unter /doc/… (eindeutig, wird großgeschrieben gespeichert).'
              : 'Chemin URL sous /doc/… (unique, en majuscules).'
          }
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="staNamespace"
          label={isDe ? 'Namespace' : 'Espace de noms'}
          rules={[{ required: true }]}
        >
          <Select
            options={NEW_PAGE_NAMESPACE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: isDe ? opt.labelDe : opt.labelFr,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
