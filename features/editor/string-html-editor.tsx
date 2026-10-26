import React from 'react';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';

interface StringHtmlEditorProps {
  html: string;
  onChange: (html: string) => void;
  serverSyncKey?: string | number;
}

const DocumentTipTap = dynamic(
  () =>
    import('./tiptap/document-tiptap').then((mod) => mod.DocumentTipTap),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: 16, textAlign: 'center' }}>
        <Spin size="small" />
      </div>
    ),
  }
);

/** Rich HTML editor for STRING properties (SAFELIST_STRING, incl. tables). */
export const StringHtmlEditor: React.FC<StringHtmlEditorProps> = ({
  html,
  onChange,
  serverSyncKey,
}) => {
  return (
    <DocumentTipTap
      html={html}
      onChange={onChange}
      serverSyncKey={serverSyncKey}
      editable
      showToolbar
      toolbarPreset="rich-html"
      interactiveContainers={false}
      minHeight={160}
    />
  );
};
