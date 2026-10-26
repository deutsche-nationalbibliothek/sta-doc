import React, { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { css } from '@emotion/react';
import { DocumentToolbar, type DocumentToolbarPreset } from './document-toolbar';
import { createDocumentHtmlEditorExtensions } from './document-editor-extensions';

export interface DocumentTipTapProps {
  html: string;
  onChange: (html: string) => void;
  /** When false, content is read-only (focused fragment mode on host). */
  editable?: boolean;
  showToolbar?: boolean;
  showSourceEscape?: boolean;
  minHeight?: number;
  /** Host page vs inline HTML string fields (no STA embed blocks in toolbar). */
  toolbarPreset?: DocumentToolbarPreset;
  interactiveContainers?: boolean;
  /** Changes after server round-trip (e.g. PUT) to apply canonical HTML in the editor. */
  serverSyncKey?: string | number;
}

const blockFrame = {
  borderRadius: 4,
  padding: '8px 10px',
  margin: '8px 0',
};

export const documentTipTapShellCss = css({
  border: '1px solid #d9d9d9',
  borderRadius: 6,
  background: '#fff',
  '.sta-doc-tiptap': {
    minHeight: 200,
    padding: '12px 14px',
    outline: 'none',
    '&.ProseMirror-focused': {
      outline: 'none',
    },
    'p.is-editor-empty:first-child::before': {
      color: '#bfbfbf',
      content: 'attr(data-placeholder)',
      float: 'left',
      height: 0,
      pointerEvents: 'none',
    },
    '.react-renderer.node-staCollapsible': {
      ...blockFrame,
      border: '1px solid #91caff',
      background: '#f0f7ff',
      '&.ProseMirror-selectednode': {
        outline: '2px solid #1677ff',
        outlineOffset: 1,
      },
    },
    '.react-renderer.node-staExample': {
      ...blockFrame,
      border: '1px dashed #d48806',
      background: '#fffbe6',
      '&.ProseMirror-selectednode': {
        outline: '2px solid #d48806',
        outlineOffset: 1,
      },
    },
    '.react-renderer.node-staEmbed': {
      ...blockFrame,
      border: '1px solid #b7eb8f',
      background: '#f6ffed',
      cursor: 'pointer',
      '&.ProseMirror-selectednode': {
        outline: '2px solid #52c41a',
        outlineOffset: 1,
      },
      '&.sta-embed-restore-flash': {
        outline: '3px solid #1677ff',
        outlineOffset: 2,
        transition: 'outline-color 0.3s ease',
      },
    },
    '.sta-block-chrome__header': {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    '.sta-container-view__content': {
      minHeight: 24,
    },
    '.sta-embed-preview': {
      marginTop: 4,
      paddingTop: 8,
      borderTop: '1px solid #d9f7be',
      fontSize: 14,
      lineHeight: 1.5,
      cursor: 'default',
      maxHeight: 320,
      overflow: 'auto',
    },
    '.sta-embed-preview__html': {
      'p, ul, ol, h1, h2, h3': {
        marginTop: '0.35em',
        marginBottom: '0.35em',
      },
      'div.embed': {
        display: 'inline-block',
        border: '1px solid #b7eb8f',
        borderRadius: 4,
        padding: '2px 8px',
        margin: '4px 0',
        background: '#f6ffed',
        fontSize: 12,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        '&::before': {
          content:
            '"↳ " attr(data-entity-id) " (" attr(data-embed-property) ")"',
        },
      },
      'div.collapsible, div.example': {
        border: '1px solid #d9d9d9',
        borderRadius: 4,
        padding: 6,
        margin: '6px 0',
        background: '#fafafa',
      },
    },
    '.sta-nested-embeds': {
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    },
    'div.description': {
      borderLeft: '3px solid #8c8c8c',
      paddingLeft: 10,
      margin: '8px 0',
      color: '#595959',
    },
    'a.ref': {
      color: '#0958d9',
      textDecoration: 'underline',
      fontWeight: 500,
    },
    'a.see': {
      color: '#531dab',
      textDecoration: 'underline dotted',
      background: '#f9f0ff',
      padding: '0 2px',
      borderRadius: 2,
    },
    'div[data-original-language]:not(.collapsible):not(.example):not(.embed):not(.description)':
      {
        borderLeft: '3px solid #13c2c2',
        paddingLeft: 10,
        margin: '8px 0',
        background: '#e6fffb',
        '&::before': {
          content:
            '"Originalsprache " attr(data-original-language) " (" attr(lang) ")"',
          display: 'block',
          fontSize: 12,
          color: '#08979c',
          marginBottom: 6,
        },
      },
    'p[data-original-language]': {
      borderLeft: '3px solid #13c2c2',
      paddingLeft: 8,
      background: '#e6fffb',
    },
    '.tableWrapper': {
      overflowX: 'auto',
      margin: '8px 0',
    },
    table: {
      borderCollapse: 'collapse',
      width: '100%',
    },
    'th, td': {
      border: '1px solid #d9d9d9',
      padding: '6px 8px',
      verticalAlign: 'top',
      minWidth: 48,
    },
    th: {
      background: '#fafafa',
      fontWeight: 600,
    },
  },
});

/**
 * Pure TipTap surface for DocumentValue.html (host or focused fragment).
 */
export const DocumentTipTap: React.FC<DocumentTipTapProps> = ({
  html,
  onChange,
  editable = true,
  showToolbar = true,
  showSourceEscape = false,
  minHeight = 200,
  toolbarPreset = 'document',
  interactiveContainers = true,
  serverSyncKey,
}) => {
  const lastEmitted = useRef(html);
  const lastServerSyncKey = useRef(serverSyncKey);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editable,
    extensions: createDocumentHtmlEditorExtensions({
      interactiveContainers,
      placeholder:
        toolbarPreset === 'rich-html'
          ? 'HTML-Inhalt bearbeiten…'
          : 'Fließtext bearbeiten…',
    }),
    content: html || '',
    onUpdate: ({ editor: current }) => {
      const next = current.getHTML();
      lastEmitted.current = next;
      onChange(next);
    },
    editorProps: {
      attributes: {
        class: 'sta-doc-tiptap',
        style: `min-height: ${minHeight}px`,
      },
    },
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      return;
    }
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      return;
    }
    const serverResync =
      serverSyncKey !== undefined &&
      serverSyncKey !== lastServerSyncKey.current;
    if (serverResync) {
      lastServerSyncKey.current = serverSyncKey;
    }
    if (!serverResync && html === lastEmitted.current) {
      return;
    }
    lastEmitted.current = html;
    editor.commands.setContent(html || '', { emitUpdate: false });
  }, [editor, html, serverSyncKey]);

  if (!editor) {
    return null;
  }

  return (
    <div>
      {showToolbar && editable ? (
        <DocumentToolbar editor={editor} preset={toolbarPreset} />
      ) : null}
      <div css={documentTipTapShellCss}>
        <EditorContent editor={editor} />
      </div>
      {showSourceEscape && editable ? (
        <details style={{ marginTop: 8 }}>
          <summary>HTML</summary>
          <textarea
            value={html}
            onChange={(event) => {
              const next = event.target.value;
              lastEmitted.current = next;
              onChange(next);
              editor.commands.setContent(next || '', { emitUpdate: false });
            }}
            rows={6}
            style={{
              width: '100%',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              marginTop: 8,
            }}
          />
        </details>
      ) : null}
    </div>
  );
};
