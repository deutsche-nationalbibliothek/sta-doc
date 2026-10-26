import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Alert, Button, Space, Spin, Table, Tabs, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useTranslation from 'next-translate/useTranslation';
import { Link } from '@/lib/next-link';
import { PageHeader } from '@/components/page-header';
import { Title } from '@/components/title';
import { useAuth } from '@/hooks/use-auth';
import { isEditorEnabled } from '@/lib/sta-editor-features';
import {
  deleteStaEntity,
  getMaintenanceReport,
} from '@/lib/api/editor-client';
import type { StaCatalogEntryDto } from '@/lib/api/catalog-types';
import { App } from 'antd';

const KIND_LABELS_DE: Record<string, string> = {
  brokenEmbeds: 'Kaputte Embeds',
  orphanFragments: 'Verwaiste Fragmente',
  pagesWithoutNotation: 'Seiten ohne Notation',
};

const KIND_LABELS_FR: Record<string, string> = {
  brokenEmbeds: 'Embeds cassés',
  orphanFragments: 'Fragments orphelins',
  pagesWithoutNotation: 'Pages sans notation',
};

export default function MaintenancePage() {
  const editorEnabled = isEditorEnabled();
  const { hasRole, loading: authLoading } = useAuth();
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<
    Awaited<ReturnType<typeof getMaintenanceReport>>['data']
  >(undefined);
  const [activeTab, setActiveTab] = useState('brokenEmbeds');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getMaintenanceReport({ language: isDe ? 'de' : 'fr' });
    if (result.error) {
      setError(result.error.message);
      setReport(undefined);
    } else {
      setReport(result.data);
    }
    setLoading(false);
  }, [isDe]);

  useEffect(() => {
    if (editorEnabled && hasRole('REDAKTEUR')) {
      void load();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [editorEnabled, hasRole, authLoading, load]);

  const onDelete = async (entityId: string) => {
    const result = await deleteStaEntity(entityId);
    if (result.error) {
      message.error(result.error.message);
      return;
    }
    message.success(isDe ? 'Aus Entwurf entfernt' : 'Retiré du brouillon');
    void load();
  };

  const columns: ColumnsType<StaCatalogEntryDto> = [
    {
      title: isDe ? 'Bezeichnung' : 'Libellé',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'ID',
      dataIndex: 'entityId',
      key: 'entityId',
      render: (id: string) => <Typography.Text code>{id}</Typography.Text>,
    },
    {
      title: 'STA-Notation',
      dataIndex: 'staNotation',
      key: 'staNotation',
    },
    {
      title: isDe ? 'Typ' : 'Type',
      dataIndex: 'pageTypeLabel',
      key: 'pageTypeLabel',
    },
    {
      title: isDe ? 'Eingehend' : 'Entrant',
      dataIndex: 'inboundRefCount',
      key: 'inboundRefCount',
    },
    {
      title: isDe ? 'Aktionen' : 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Space>
          {row.staNotation && row.role !== 'broken' ? (
            <Link href={`/${row.staNotation}`} query={{ edit: '1', stage: 'working' }}>
              {isDe ? 'Bearbeiten' : 'Modifier'}
            </Link>
          ) : row.role !== 'broken' ? (
            <Link href={`/edit/${row.entityId}`}>
              {isDe ? 'Bearbeiten' : 'Modifier'}
            </Link>
          ) : null}
          {row.role !== 'broken' ? (
            <Button
              type="link"
              danger
              size="small"
              onClick={() => void onDelete(row.entityId)}
            >
              {isDe ? 'Entfernen' : 'Retirer'}
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  if (!editorEnabled) {
    return (
      <Alert type="info" message="Editor ist deaktiviert." showIcon />
    );
  }

  if (authLoading || loading) {
    return <Spin />;
  }

  if (!hasRole('REDAKTEUR')) {
    return (
      <Alert
        type="warning"
        showIcon
        message={isDe ? 'Keine Berechtigung' : 'Accès refusé'}
        description={
          <Link href="/edit/login" query={{ next: '/maintenance' }}>
            {isDe ? 'Anmelden' : 'Connexion'}
          </Link>
        }
      />
    );
  }

  const kindLabels = isDe ? KIND_LABELS_DE : KIND_LABELS_FR;
  const tabItems = Object.keys(kindLabels).map((key) => ({
    key,
    label: `${kindLabels[key] ?? key} (${report?.summary?.[key] ?? 0})`,
    children: (
      <Table
        rowKey="entityId"
        columns={columns}
        dataSource={report?.items?.[key] ?? []}
        pagination={{ pageSize: 25 }}
        size="small"
      />
    ),
  }));

  return (
    <>
      <Head>
        <title>{isDe ? 'Wartung' : 'Maintenance'} | sta-doc</title>
      </Head>
      <PageHeader
        title={
          <Title
            headline={{
              title: isDe ? 'Wartung — Verwaistes & kaputte Embeds' : 'Maintenance',
              level: 1,
              key: 'maintenance',
            }}
          />
        }
        extra={
          <Button onClick={() => void load()} disabled={loading}>
            {isDe ? 'Aktualisieren' : 'Actualiser'}
          </Button>
        }
      />
      {error ? (
        <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />
      ) : null}
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </>
  );
}
