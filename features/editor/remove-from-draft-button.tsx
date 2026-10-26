import React, { useState } from 'react';
import { App, Button, List, Modal, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import {
  deleteStaEntity,
  getEntityReferences,
} from '@/lib/api/editor-client';
import type { StaEntryReferenceDto } from '@/lib/api/catalog-types';

interface RemoveFromDraftButtonProps {
  entityId: string;
  staNotationLabel?: string;
}

export const RemoveFromDraftButton: React.FC<RemoveFromDraftButtonProps> = ({
  entityId,
  staNotationLabel,
}) => {
  const { message } = App.useApp();
  const router = useRouter();
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';
  const [open, setOpen] = useState(false);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [inbound, setInbound] = useState<StaEntryReferenceDto[]>([]);

  const loadInbound = async () => {
    setLoadingRefs(true);
    try {
      const result = await getEntityReferences(entityId, { direction: 'inbound' });
      setInbound(result.data?.references ?? []);
    } finally {
      setLoadingRefs(false);
    }
  };

  const onOpen = () => {
    setOpen(true);
    void loadInbound();
  };

  const onConfirmDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteStaEntity(entityId);
      if (result.error) {
        message.error(result.error.message);
        return;
      }
      message.success(
        isDe
          ? 'Seite aus dem Entwurf entfernt (Live unverändert bis Veröffentlichung).'
          : 'Page retirée du brouillon.'
      );
      setOpen(false);
      await router.push(staNotationLabel ? `/${staNotationLabel}` : '/');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Button
        danger
        size="small"
        icon={<DeleteOutlined />}
        onClick={onOpen}
      >
        {isDe ? 'Aus Entwurf entfernen' : 'Retirer du brouillon'}
      </Button>
      <Modal
        title={isDe ? 'Seite aus Entwurf entfernen?' : 'Retirer la page du brouillon ?'}
        open={open}
        onCancel={() => setOpen(false)}
        okText={isDe ? 'Entfernen' : 'Retirer'}
        cancelText={isDe ? 'Abbrechen' : 'Annuler'}
        okButtonProps={{ danger: true, loading: deleting }}
        onOk={() => void onConfirmDelete()}
      >
        <Typography.Paragraph>
          {isDe
            ? 'Die Seite wird nur aus der Working Copy gelöscht. Live und Preview bleiben bis zur nächsten Veröffentlichung unverändert.'
            : 'La page est supprimée uniquement de la copie de travail.'}
        </Typography.Paragraph>
        {loadingRefs ? (
          <Typography.Text type="secondary">
            {isDe ? 'Referenzen werden geladen…' : 'Chargement des références…'}
          </Typography.Text>
        ) : inbound.length > 0 ? (
          <>
            <Typography.Text type="warning">
              {isDe
                ? `Warnung: ${inbound.length} Seite(n) betten diese Entity ein:`
                : `Attention : ${inbound.length} page(s) incorporent cette entité :`}
            </Typography.Text>
            <List
              size="small"
              dataSource={inbound}
              renderItem={(ref) => (
                <List.Item>
                  <Typography.Text code>{ref.sourceEntityId}</Typography.Text>
                  {ref.sourceTitle ? ` — ${ref.sourceTitle}` : null}
                </List.Item>
              )}
            />
          </>
        ) : null}
      </Modal>
    </>
  );
};
