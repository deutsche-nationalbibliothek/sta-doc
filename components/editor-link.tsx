import React from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface EditorLinkProps {
  entityId: string;
  children?: React.ReactNode;
  type?: 'link' | 'button';
  size?: 'small' | 'middle' | 'large';
}

export const EditorLink: React.FC<EditorLinkProps> = ({ 
  entityId, 
  children, 
  type = 'button',
  size = 'small'
}) => {
  // Prüfen ob Editor aktiviert ist
  if (process.env.NEXT_PUBLIC_EDITOR_ENABLED !== 'true') {
    return null;
  }

  const editorUrl = `/editor/${entityId}`;

  if (type === 'link') {
    return (
      <Link href={editorUrl}>
        {children || 'Bearbeiten'}
      </Link>
    );
  }

  return (
    <Button
      type="primary"
      size={size}
      icon={<EditOutlined />}
      href={editorUrl}
    >
      {children || 'Editor'}
    </Button>
  );
};
