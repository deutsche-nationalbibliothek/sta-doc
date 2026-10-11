import React from 'react';
import { Input, Typography } from 'antd';

interface DocumentHtmlEditorProps {
  html: string;
  onChange: (html: string) => void;
}

/**
 * Interim editor for DocumentValue.html (TipTap comes later).
 * Shows baked HTML including layout/embed/description/see atoms and lang marks.
 */
export const DocumentHtmlEditor: React.FC<DocumentHtmlEditorProps> = ({
  html,
  onChange,
}) => {
  return (
    <div>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
        Dokument-HTML (
        <Typography.Text code>div.collapsible</Typography.Text>,{' '}
        <Typography.Text code>div.example</Typography.Text>,{' '}
        <Typography.Text code>div.embed</Typography.Text>,{' '}
        <Typography.Text code>div.description</Typography.Text>,{' '}
        <Typography.Text code>a.ref</Typography.Text>,{' '}
        <Typography.Text code>a.see</Typography.Text>,{' '}
        <Typography.Text code>lang</Typography.Text>)
      </Typography.Paragraph>
      <Input.TextArea
        value={html}
        onChange={(event) => onChange(event.target.value)}
        autoSize={{ minRows: 8, maxRows: 32 }}
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
      />
    </div>
  );
};
