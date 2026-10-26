import React, { useMemo } from 'react';
import { Alert, Button, Spin, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { primaryDocumentSection } from '@/lib/api/sta-entry-types';
import { useStaEntry } from '../use-sta-entry';
import { useEmbedFocusOptional } from './embed-focus-context';

interface EmbedTargetPreviewProps {
  entityId: string;
}

function collectNestedEmbeds(
  html: string
): { entityId: string; embedProperty: string }[] {
  if (typeof DOMParser === 'undefined' || !html.trim()) {
    return [];
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const seen = new Set<string>();
  const out: { entityId: string; embedProperty: string }[] = [];
  doc.querySelectorAll('div.embed[data-entity-id]').forEach((element) => {
    const entityId = element.getAttribute('data-entity-id')?.trim();
    if (!entityId || seen.has(entityId)) {
      return;
    }
    seen.add(entityId);
    out.push({
      entityId,
      embedProperty: element.getAttribute('data-embed-property') || 'P396',
    });
  });
  return out;
}

/**
 * Read-only Working-Copy preview of an embed target.
 * Nested embeds are listed with „Bearbeiten“ to enter focused edit (model A).
 */
export const EmbedTargetPreview: React.FC<EmbedTargetPreviewProps> = ({
  entityId,
}) => {
  const { entry, loading, missing } = useStaEntry(entityId);
  const focus = useEmbedFocusOptional();
  const html = entry
    ? primaryDocumentSection(entry)?.value.html?.trim() || ''
    : '';
  const nested = useMemo(() => collectNestedEmbeds(html), [html]);

  if (loading) {
    return (
      <div className="sta-embed-preview" contentEditable={false}>
        <Spin size="small" />
        <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
          Ziel wird geladen…
        </Typography.Text>
      </div>
    );
  }

  if (missing || !entry) {
    return (
      <div className="sta-embed-preview" contentEditable={false}>
        <Alert
          type="warning"
          showIcon
          message={`Ziel ${entityId} nicht in der Working Copy gefunden`}
        />
      </div>
    );
  }

  const title =
    entry.title?.trim() ||
    entry.labels?.find((label) => label.value?.trim())?.value?.trim() ||
    entityId;

  return (
    <div className="sta-embed-preview" contentEditable={false}>
      <Typography.Text strong style={{ display: 'block', marginBottom: 6 }}>
        {title}
      </Typography.Text>
      {html ? (
        <div
          className="sta-embed-preview__html"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <Typography.Text type="secondary">
          Kein Dokumentinhalt an diesem Ziel.
        </Typography.Text>
      )}
      {nested.length > 0 && focus ? (
        <div className="sta-nested-embeds">
          {nested.map((item) => (
            <NestedEmbedEditRow
              key={item.entityId}
              entityId={item.entityId}
              onEdit={() =>
                focus.beginFocus({
                  entityId: item.entityId,
                })
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const NestedEmbedEditRow: React.FC<{
  entityId: string;
  onEdit: () => void;
}> = ({ entityId, onEdit }) => {
  const { entry, loading } = useStaEntry(entityId);
  const label =
    entry?.title?.trim() ||
    entry?.labels?.find((item) => item.value?.trim())?.value?.trim();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        padding: '4px 8px',
        background: '#f6ffed',
        border: '1px solid #b7eb8f',
        borderRadius: 4,
      }}
    >
      <Typography.Text code>{entityId}</Typography.Text>
      <Typography.Text type="secondary">
        {loading ? '…' : label || 'ohne Titel'}
      </Typography.Text>
      <Button
        size="small"
        icon={<EditOutlined />}
        onClick={onEdit}
        onMouseDown={(event) => event.preventDefault()}
      >
        Bearbeiten
      </Button>
    </div>
  );
};
