import React from 'react';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';

interface DocumentHtmlEditorProps {
  html: string;
  onChange: (html: string) => void;
  serverSyncKey?: string | number;
}

const DocumentEditor = dynamic(
  () =>
    import('./tiptap/document-editor').then((mod) => mod.DocumentEditor),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin />
        <div style={{ marginTop: 8 }}>Editor wird geladen…</div>
      </div>
    ),
  }
);

/**
 * DocumentValue.html editor — TipTap spike (Sprint 4).
 * Same contract as before: html string in / onChange(html) out.
 */
export const DocumentHtmlEditor: React.FC<DocumentHtmlEditorProps> = ({
  html,
  onChange,
  serverSyncKey,
}) => {
  return (
    <DocumentEditor
      html={html}
      onChange={onChange}
      serverSyncKey={serverSyncKey}
    />
  );
};
