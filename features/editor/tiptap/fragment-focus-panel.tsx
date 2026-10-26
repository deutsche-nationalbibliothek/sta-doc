import React, { useEffect, useState } from 'react';
import { Alert, Breadcrumb, Button, Space, Spin, Typography } from 'antd';
import {
  getStaContent,
  updateStaContent,
  type EditorApiError,
  type StaEntryDto,
} from '@/lib/api/editor-client';
import {
  primaryDocumentSection,
  withDocumentHtml,
} from '@/lib/api/sta-entry-types';
import { invalidateStaEntry, reloadStaEntry } from '../use-sta-entry';
import { DocumentActionsProvider } from './document-actions-context';
import { useEmbedFocus } from './embed-focus-context';
import { DocumentTipTap } from './document-tiptap';

/**
 * Focused fragment editor (model A): one entity at a time; host stays locked
 * until the stack is cleared via Speichern / Abbrechen.
 */
export const FragmentFocusPanel: React.FC = () => {
  const { active, stack, endFocus, popTo, clearFocus, bumpPreview } =
    useEmbedFocus();
  const [entry, setEntry] = useState<StaEntryDto | undefined>();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!active) {
      setEntry(undefined);
      setHtml('');
      setDirty(false);
      setError(undefined);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(undefined);
    setDirty(false);
    void getStaContent(active.entityId).then((result) => {
      if (cancelled) {
        return;
      }
      setLoading(false);
      if (result.error || !result.data) {
        setEntry(undefined);
        setHtml('');
        setError(
          result.error?.message ||
            `Fragment ${active.entityId} konnte nicht geladen werden`
        );
        return;
      }
      setEntry(result.data);
      setHtml(primaryDocumentSection(result.data)?.value.html ?? '');
    });
    return () => {
      cancelled = true;
    };
  }, [active?.entityId]);

  if (!active) {
    return null;
  }

  const title =
    entry?.title?.trim() ||
    active.title ||
    entry?.labels?.find((label) => label.value?.trim())?.value?.trim() ||
    active.entityId;

  const onCancel = () => {
    if (dirty && !window.confirm('Ungespeicherte Änderungen verwerfen?')) {
      return;
    }
    endFocus();
  };

  const onSave = async () => {
    if (!entry) {
      return;
    }
    setSaving(true);
    setError(undefined);
    const language = entry.language || 'de';
    const next = withDocumentHtml(entry, language, html);
    const result = await updateStaContent(active.entityId, next);
    setSaving(false);
    if (result.error) {
      setError(formatError(result.error));
      return;
    }
    invalidateStaEntry(active.entityId);
    await reloadStaEntry(active.entityId);
    bumpPreview();
    setDirty(false);
    endFocus();
  };

  return (
    <div
      style={{
        border: '2px solid #1677ff',
        borderRadius: 8,
        padding: 12,
        background: '#f5f9ff',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Breadcrumb
            items={[
              {
                title: (
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, height: 'auto' }}
                    onClick={() => {
                      if (
                        dirty &&
                        !window.confirm('Ungespeicherte Änderungen verwerfen?')
                      ) {
                        return;
                      }
                      clearFocus();
                    }}
                  >
                    Elterndokument
                  </Button>
                ),
              },
              ...stack.map((frame, index) => ({
                title:
                  index === stack.length - 1 ? (
                    <Typography.Text strong>
                      {frame.title || frame.entityId}
                    </Typography.Text>
                  ) : (
                    <Button
                      type="link"
                      size="small"
                      style={{ padding: 0, height: 'auto' }}
                      onClick={() => {
                        if (
                          dirty &&
                          !window.confirm(
                            'Ungespeicherte Änderungen verwerfen?'
                          )
                        ) {
                          return;
                        }
                        popTo(index);
                      }}
                    >
                      {frame.title || frame.entityId}
                    </Button>
                  ),
              })),
            ]}
          />
        </div>

        <Typography.Title level={5} style={{ margin: 0 }}>
          {title}{' '}
          <Typography.Text type="secondary" code>
            {active.entityId}
          </Typography.Text>
          {entry?.role === 'page' ? (
            <Typography.Text type="secondary"> (Seite)</Typography.Text>
          ) : (
            <Typography.Text type="secondary"> (Fragment)</Typography.Text>
          )}
        </Typography.Title>

        {error ? <Alert type="error" showIcon message={error} /> : null}

        {loading || !entry ? (
          <Spin />
        ) : (
          <DocumentActionsProvider
            value={{
              mode: 'fragment',
              onSave: () => void onSave(),
              onCancel,
              saving,
              cancelDisabled: !dirty,
              saveLabel: 'Speichern & zurück',
              cancelLabel: 'Abbrechen',
            }}
          >
            <DocumentTipTap
              key={active.entityId}
              html={html}
              onChange={(next) => {
                setHtml(next);
                setDirty(true);
              }}
              editable
              showToolbar
              showSourceEscape
              minHeight={180}
            />
          </DocumentActionsProvider>
        )}
      </Space>
    </div>
  );
};

function formatError(error: EditorApiError): string {
  if (error.conflict) {
    return 'Versionskonflikt: Das Fragment wurde zwischenzeitlich geändert.';
  }
  if (error.details && error.details !== error.message) {
    return `${error.message}: ${error.details}`;
  }
  return error.message;
}
