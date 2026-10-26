import React from 'react';
import { Button, Space, Typography } from 'antd';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';

interface BlockChromeProps {
  label: string;
  selected?: boolean;
  /** Extra controls between label and delete actions */
  extra?: React.ReactNode;
  onDelete: () => void;
  /** Unwrap frame, keep content (collapsible / example). */
  onUnwrap?: () => void;
  children?: React.ReactNode;
}

/**
 * Shared header chrome for layout blocks (embed / collapsible / example).
 * Delete always lives here — not in the document toolbar.
 */
export const BlockChrome: React.FC<BlockChromeProps> = ({
  label,
  selected,
  extra,
  onDelete,
  onUnwrap,
  children,
}) => {
  return (
    <div className={`sta-block-chrome${selected ? ' is-selected' : ''}`}>
      <div
        className="sta-block-chrome__header"
        contentEditable={false}
        onMouseDown={(event) => {
          // Keep node selection / avoid stealing focus into inputs oddly.
          if ((event.target as HTMLElement).closest('input,textarea,button,.ant-select')) {
            return;
          }
          event.preventDefault();
        }}
      >
        <Typography.Text type="secondary" style={{ fontSize: 12, flexShrink: 0 }}>
          {label}
        </Typography.Text>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>{extra}</div>
        <Space size={4} wrap onMouseDown={(event) => event.preventDefault()}>
          {onUnwrap ? (
            <Button
              size="small"
              icon={<ExportOutlined />}
              onClick={onUnwrap}
              aria-label="Rahmen auflösen (Inhalt behalten)"
              title="Rahmen auflösen (Inhalt behalten)"
            />
          ) : null}
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
            aria-label={`${label} löschen`}
            title={`${label} löschen`}
          />
        </Space>
      </div>
      {children}
    </div>
  );
};
