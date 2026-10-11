import React from 'react';
import { Card, Typography } from 'antd';
import {
  StaContentDto,
  StaFullStatementDto,
} from '@/lib/api/sta-content-types';
import { StringValueComponent } from '@/features/entity/components/values/string';

interface EmbeddedContentPreviewProps {
  embedded: StaContentDto;
  depth?: number;
}

/**
 * Read-only preview of embedded StaContent blocks (Sprint 1: no embed editing).
 */
export const EmbeddedContentPreview: React.FC<EmbeddedContentPreviewProps> = ({
  embedded,
  depth = 0,
}) => {
  if (depth > 4) {
    return (
      <Typography.Text type="secondary">
        … (verschachtelter Inhalt gekürzt)
      </Typography.Text>
    );
  }

  return (
    <Card
      size="small"
      type="inner"
      title={
        <Typography.Text type="secondary">
          Eingebettet: {embedded.title || embedded.entityId}
        </Typography.Text>
      }
      style={{ marginTop: 8, background: '#fafafa' }}
    >
      {(embedded.statements ?? []).map((statement, index) => (
        <EmbeddedStatementPreview
          key={statement.id ?? `${embedded.entityId}-${index}`}
          statement={statement}
          depth={depth}
        />
      ))}
    </Card>
  );
};

interface EmbeddedStatementPreviewProps {
  statement: StaFullStatementDto;
  depth: number;
}

const EmbeddedStatementPreview: React.FC<EmbeddedStatementPreviewProps> = ({
  statement,
  depth,
}) => (
  <div style={{ marginBottom: 8 }}>
    <Typography.Text strong>
      {statement.property.label || statement.property.key}
    </Typography.Text>
    <StringValueComponent stringValue={{ value: statement.value }} />
    {(statement.embeddedContents ?? []).map((embedded, index) => (
      <EmbeddedContentPreview
        key={embedded.entityId ?? index}
        embedded={embedded}
        depth={depth + 1}
      />
    ))}
  </div>
);

export function hasEmbeddedContents(statement: StaFullStatementDto): boolean {
  return (statement.embeddedContents?.length ?? 0) > 0;
}
