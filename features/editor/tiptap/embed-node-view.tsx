import React, { useState } from 'react';
import { Button, Select, Space, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from '@tiptap/react';
import { BlockChrome } from './block-chrome';
import { EntityIdModal } from './entity-id-modal';
import { EmbedTargetPreview } from './embed-target-preview';
import { StaEmbed } from './document-nodes';
import { useStaEntry } from '../use-sta-entry';
import { useEmbedFocusOptional } from './embed-focus-context';

const EMBED_PROPERTY_OPTIONS = [
  { value: 'P396', label: 'Embed' },
  { value: 'P11', label: 'Beispiel' },
  { value: 'P693', label: 'GND-Implementierung' },
];

/**
 * Embed shell: reference + read-only preview.
 * Content editing uses focused fragment mode (model A), not /edit/… pages.
 */
export function StaEmbedView({
  node,
  selected,
  updateAttributes,
  deleteNode,
}: ReactNodeViewProps) {
  const entityId = (node.attrs.entityId as string) || '';
  const embedProperty = (node.attrs.embedProperty as string) || 'P396';
  const { entry, loading: entryLoading } = useStaEntry(entityId || undefined);
  const focus = useEmbedFocusOptional();
  const label =
    entry?.title?.trim() ||
    entry?.labels?.find((item) => item.value?.trim())?.value?.trim();
  const [retargetOpen, setRetargetOpen] = useState(false);
  const hostLocked = focus?.hostLocked ?? false;
  const isActiveFocus = focus?.active?.entityId === entityId;
  // Reference edits only on the unlocked surface; content focus may deepen the stack.
  const lockReferenceControls = hostLocked;

  const startContentEdit = () => {
    if (!entityId || !focus) {
      return;
    }
    focus.beginFocus({
      entityId,
      title: label || entityId,
    });
  };

  return (
    <NodeViewWrapper as="div" className="sta-embed-view" data-drag-handle>
      <BlockChrome
        label="Embed"
        selected={selected || isActiveFocus}
        onDelete={() => {
          if (!lockReferenceControls) {
            deleteNode();
          }
        }}
        extra={
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 8,
            }}
            onDoubleClick={(event) => {
              event.preventDefault();
              if (!lockReferenceControls) {
                setRetargetOpen(true);
              }
            }}
          >
            <div style={{ minWidth: 0 }}>
              <Typography.Text code>{entityId || '—'}</Typography.Text>
              {entityId && (
                <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                  {entryLoading ? '…' : label || 'ohne Titel'}
                </Typography.Text>
              )}
            </div>
            <Space size={4} wrap onMouseDown={(event) => event.preventDefault()}>
              <Select
                size="small"
                value={embedProperty}
                options={EMBED_PROPERTY_OPTIONS}
                style={{ minWidth: 160 }}
                disabled={lockReferenceControls}
                onChange={(value) =>
                  updateAttributes({ embedProperty: value })
                }
                aria-label="Embed-Property"
              />
              <Button
                size="small"
                icon={<EditOutlined />}
                disabled={lockReferenceControls}
                onClick={() => setRetargetOpen(true)}
                aria-label="Embed-Referenz ändern"
              >
                Ziel
              </Button>
              {entityId ? (
                <Button
                  size="small"
                  type="primary"
                  ghost
                  icon={<EditOutlined />}
                  disabled={!focus}
                  onClick={startContentEdit}
                  aria-label="Fragment-Inhalt fokussiert bearbeiten"
                >
                  Bearbeiten
                </Button>
              ) : null}
            </Space>
          </div>
        }
      />

      {entityId ? (
        <EmbedTargetPreview
          key={`${entityId}-${focus?.previewEpoch ?? 0}`}
          entityId={entityId}
        />
      ) : null}

      <EntityIdModal
        open={retargetOpen}
        title="Embed-Ziel ändern"
        initialId={entityId}
        allowPropertyIds={false}
        onCancel={() => setRetargetOpen(false)}
        onSubmit={(nextId) => {
          updateAttributes({ entityId: nextId });
          setRetargetOpen(false);
        }}
      />
    </NodeViewWrapper>
  );
}

/** StaEmbed with interactive NodeView (use in the browser editor only). */
export const StaEmbedInteractive = StaEmbed.extend({
  addNodeView() {
    return ReactNodeViewRenderer(StaEmbedView, {
      as: 'div',
      className: 'embed',
      attrs: ({ node }) => ({
        'data-entity-id': String(node.attrs.entityId ?? ''),
        'data-embed-property': String(node.attrs.embedProperty ?? 'P396'),
      }),
    });
  },
});
