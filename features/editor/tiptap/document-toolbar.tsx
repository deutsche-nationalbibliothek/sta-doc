import React, { useState } from 'react';
import { Button, Divider, Select, Space, Tooltip } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  DisconnectOutlined,
  TableOutlined,
  InsertRowBelowOutlined,
  InsertRowRightOutlined,
  DeleteRowOutlined,
  DeleteColumnOutlined,
  DeleteOutlined,
  BorderTopOutlined,
  BorderLeftOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { useEditorState, type Editor } from '@tiptap/react';
import { EntityIdModal } from './entity-id-modal';
import { useDocumentActions } from './document-actions-context';
import {
  applyEntityLink,
  applyWebLink,
  clearLink,
  linkKindOf,
} from './link-helpers';
import {
  ORIGINAL_LANGUAGE_OPTIONS,
  bcp47ForOriginalLanguage,
} from './original-language';

const stickyToolbarCss = css({
  position: 'sticky',
  top: 0,
  zIndex: 30,
  background: 'rgba(255, 255, 255, 0.96)',
  backdropFilter: 'blur(8px)',
  borderBottom: '1px solid #f0f0f0',
  padding: '8px 0',
  marginBottom: 8,
});

export type DocumentToolbarPreset = 'document' | 'rich-html';

interface DocumentToolbarProps {
  editor: Editor;
  preset?: DocumentToolbarPreset;
}

type EntityModalMode = 'ref' | 'see' | null;

function ToolButton({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip title={title}>
      <Button
        type={active ? 'primary' : 'default'}
        size="small"
        disabled={disabled}
        onClick={onClick}
        aria-label={title}
      >
        {children}
      </Button>
    </Tooltip>
  );
}

function currentOriginalLanguage(editor: Editor): string | undefined {
  if (editor.isActive('staLangPassage')) {
    return (
      (editor.getAttributes('staLangPassage').originalLanguage as string) ||
      undefined
    );
  }
  if (editor.isActive('paragraph')) {
    return (
      (editor.getAttributes('paragraph').originalLanguage as string) ||
      undefined
    );
  }
  if (editor.isActive('staCollapsible')) {
    return (
      (editor.getAttributes('staCollapsible').originalLanguage as string) ||
      undefined
    );
  }
  if (editor.isActive('staExample')) {
    return (
      (editor.getAttributes('staExample').originalLanguage as string) ||
      undefined
    );
  }
  return undefined;
}

function applyOriginalLanguage(
  editor: Editor,
  originalLanguageId: string | null
) {
  const lang = originalLanguageId
    ? bcp47ForOriginalLanguage(originalLanguageId)
    : null;
  const attrs = {
    lang,
    originalLanguage: originalLanguageId,
  };

  if (!originalLanguageId) {
    if (editor.isActive('staLangPassage')) {
      editor.chain().focus().unsetStaLangPassage().run();
      return;
    }
    if (editor.isActive('paragraph')) {
      editor
        .chain()
        .focus()
        .updateAttributes('paragraph', {
          lang: null,
          originalLanguage: null,
        })
        .run();
      return;
    }
    if (editor.isActive('staCollapsible')) {
      editor
        .chain()
        .focus()
        .updateAttributes('staCollapsible', {
          lang: null,
          originalLanguage: null,
        })
        .run();
      return;
    }
    if (editor.isActive('staExample')) {
      editor
        .chain()
        .focus()
        .updateAttributes('staExample', {
          lang: null,
          originalLanguage: null,
        })
        .run();
      return;
    }
    return;
  }

  if (editor.isActive('staLangPassage')) {
    editor.chain().focus().updateAttributes('staLangPassage', attrs).run();
    return;
  }
  if (editor.isActive('staCollapsible')) {
    editor.chain().focus().updateAttributes('staCollapsible', attrs).run();
    return;
  }
  if (editor.isActive('staExample')) {
    editor.chain().focus().updateAttributes('staExample', attrs).run();
    return;
  }

  editor.chain().focus().setStaLangPassage(attrs).run();
}

/**
 * Sticky formatting toolbar; optional Speichern/Abbrechen/Validieren via
 * DocumentActionsProvider (host page or fragment focus panel).
 */
export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  editor,
  preset = 'document',
}) => {
  const actions = useDocumentActions();
  const [entityModal, setEntityModal] = useState<EntityModalMode>(null);
  const linkKind = linkKindOf(editor);
  const originalLanguage = currentOriginalLanguage(editor);
  const inTable = useEditorState({
    editor,
    selector: ({ editor: current }) => current.isActive('table'),
  });
  const showStaBlocks = preset === 'document';

  const setWebLink = () => {
    const previous =
      linkKind === 'web'
        ? (editor.getAttributes('link').href as string | undefined)
        : 'https://';
    const url = window.prompt('Externe Link-URL', previous || 'https://');
    if (url === null) {
      return;
    }
    if (url.trim() === '') {
      clearLink(editor);
      return;
    }
    applyWebLink(editor, url.trim());
  };

  const insertCollapsible = () => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'staCollapsible',
        attrs: { intro: 'Mehr erfahren' },
        content: [{ type: 'paragraph' }],
      })
      .run();
  };

  const insertExample = () => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'staExample',
        content: [{ type: 'paragraph' }],
      })
      .run();
  };

  const insertEmbed = () => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'staEmbed',
        attrs: { entityId: '', embedProperty: 'P396' },
      })
      .run();
  };

  return (
    <div>
      <div
        className="sta-doc-toolbar-sticky"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          marginBottom: 8,
          paddingTop: 4,
          paddingBottom: 8,
          background: 'rgba(255, 255, 255, 0.96)',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Space wrap size={[4, 4]}>
          <ToolButton
            title="Fett"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <BoldOutlined />
          </ToolButton>
          <ToolButton
            title="Kursiv"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <ItalicOutlined />
          </ToolButton>
          <Divider type="vertical" />
          <ToolButton
            title="Überschrift 2"
            active={editor.isActive('heading', { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </ToolButton>
          <ToolButton
            title="Überschrift 3"
            active={editor.isActive('heading', { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </ToolButton>
          <Divider type="vertical" />
          <ToolButton
            title="Aufzählung"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <UnorderedListOutlined />
          </ToolButton>
          <ToolButton
            title="Nummerierung"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <OrderedListOutlined />
          </ToolButton>
          <Divider type="vertical" />
          <ToolButton
            title="Externer Link (https)"
            active={linkKind === 'web'}
            onClick={setWebLink}
          >
            <LinkOutlined />
          </ToolButton>
          <ToolButton
            title="Seitenverweis (a.ref)"
            active={linkKind === 'ref'}
            onClick={() => setEntityModal('ref')}
          >
            Ref
          </ToolButton>
          <ToolButton
            title="Siehe-Verweis (a.see)"
            active={linkKind === 'see'}
            onClick={() => setEntityModal('see')}
          >
            Siehe
          </ToolButton>
          <ToolButton
            title="Link entfernen"
            disabled={!linkKind}
            onClick={() => clearLink(editor)}
          >
            <DisconnectOutlined />
          </ToolButton>
          <Divider type="vertical" />
          <Select
            size="small"
            allowClear
            placeholder="Originalsprache (P132)"
            style={{ minWidth: 180 }}
            value={originalLanguage}
            options={ORIGINAL_LANGUAGE_OPTIONS.map((option) => ({
              value: option.entityId,
              label: option.label,
            }))}
            onChange={(value) =>
              applyOriginalLanguage(editor, (value as string) || null)
            }
          />
          <Divider type="vertical" />
          <ToolButton
            title="Zusammenklappbar einfügen"
            onClick={insertCollapsible}
          >
            Klapp
          </ToolButton>
          <ToolButton title="Beispiel einfügen" onClick={insertExample}>
            Bsp
          </ToolButton>
          <ToolButton title="Embed-Referenz einfügen" onClick={insertEmbed}>
            Emb
          </ToolButton>
          <Divider type="vertical" />
          {inTable ? (
            <>
              <ToolButton
                title="Kopfzeile umschalten (erste Zeile als th)"
                disabled={!editor.can().toggleHeaderRow()}
                active={editor.isActive('tableHeader')}
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              >
                <BorderTopOutlined />
              </ToolButton>
              <ToolButton
                title="Kopfspalte umschalten (erste Spalte als th)"
                disabled={!editor.can().toggleHeaderColumn()}
                onClick={() =>
                  editor.chain().focus().toggleHeaderColumn().run()
                }
              >
                <BorderLeftOutlined />
              </ToolButton>
              <ToolButton
                title="Zeile unten einfügen"
                disabled={!editor.can().addRowAfter()}
                onClick={() => editor.chain().focus().addRowAfter().run()}
              >
                <InsertRowBelowOutlined />
              </ToolButton>
              <ToolButton
                title="Aktuelle Zeile löschen"
                disabled={!editor.can().deleteRow()}
                onClick={() => editor.chain().focus().deleteRow().run()}
              >
                <DeleteRowOutlined />
              </ToolButton>
              <ToolButton
                title="Spalte rechts einfügen"
                disabled={!editor.can().addColumnAfter()}
                onClick={() => editor.chain().focus().addColumnAfter().run()}
              >
                <InsertRowRightOutlined />
              </ToolButton>
              <ToolButton
                title="Aktuelle Spalte löschen"
                disabled={!editor.can().deleteColumn()}
                onClick={() =>
                  editor.chain().focus().deleteColumn().run()
                }
              >
                <DeleteColumnOutlined />
              </ToolButton>
              <ToolButton
                title="Ganze Tabelle löschen"
                disabled={!editor.can().deleteTable()}
                onClick={() => editor.chain().focus().deleteTable().run()}
              >
                <DeleteOutlined />
              </ToolButton>
            </>
          ) : (
            <ToolButton
              title="Tabelle einfügen (3×3, mit Kopfzeile)"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
            >
              <TableOutlined />
            </ToolButton>
          )}
        </Space>
      </div>

      <EntityIdModal
        open={entityModal === 'ref'}
        title="Seitenverweis (a.ref)"
        initialId={
          linkKind === 'ref'
            ? (editor.getAttributes('link').entityId as string) || ''
            : ''
        }
        allowPropertyIds={false}
        onCancel={() => setEntityModal(null)}
        onSubmit={(entityId, label) => {
          applyEntityLink(editor, 'ref', entityId, label);
          setEntityModal(null);
        }}
      />
      <EntityIdModal
        open={entityModal === 'see'}
        title="Siehe-Verweis (a.see)"
        initialId={
          linkKind === 'see'
            ? (editor.getAttributes('link').entityId as string) || ''
            : ''
        }
        allowPropertyIds={true}
        onCancel={() => setEntityModal(null)}
        onSubmit={(entityId, label) => {
          applyEntityLink(editor, 'see', entityId, label || entityId);
          setEntityModal(null);
        }}
      />
    </div>
  );
};
