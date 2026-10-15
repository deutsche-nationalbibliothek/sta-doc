import { Tooltip } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

const wikibaseStatementUrl = (statementKey: string) => {
  const entityId = statementKey.split('$')[0];
  const namespace = entityId.startsWith('P') ? 'Property' : 'Item';
  const base = (
    process.env.NEXT_PUBLIC_URL || 'https://edit.sta.dnb.de'
  ).replace(/\/$/, '');

  return `${base}/wiki/${namespace}:${entityId}#${statementKey}`;
};

export const WikibaseStatementLink = ({
  statementKey,
}: {
  statementKey: string;
}) => (
  <Tooltip title="In Wikibase öffnen">
    <a
      href={wikibaseStatementUrl(statementKey)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="In Wikibase öffnen"
      className="wikibase-statement-link"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <ExportOutlined />
    </a>
  </Tooltip>
);
