import { Tooltip } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import useTranslation from 'next-translate/useTranslation';

// Builds the Wikibase URL of a single statement.
const wikibaseStatementUrl = (statementKey: string) => {
  const entityId = statementKey.split('$')[0];
  const namespace = entityId.startsWith('P') ? 'Property' : 'Item';
  const base = (
    process.env.NEXT_PUBLIC_URL || 'https://edit.sta.dnb.de'
  ).replace(/\/$/, '');

  return `${base}/wiki/${namespace}:${entityId}#${statementKey}`;
};

// Icon link that opens a statement in Wikibase in a new tab.
export const WikibaseStatementLink = ({
  statementKey,
}: {
  statementKey: string;
}) => {
  const { t } = useTranslation('wikibase');

  return (
    <Tooltip title={t('actions.openInWikibase')}>
      <a
        href={wikibaseStatementUrl(statementKey)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('actions.openInWikibase')}
        className="wikibase-statement-link"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <ExportOutlined />
      </a>
    </Tooltip>
  );
};
