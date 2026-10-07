import { EditOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { wikibaseStatementUrl } from '@/utils/wikibase-statement-url';

interface WikibaseStatementLinkProps {
  statementId: string;
}

export const WikibaseStatementLink: React.FC<WikibaseStatementLinkProps> = ({
  statementId,
}) => {
  const { t } = useTranslation('common');
  const tooltipTitle = t('open-in-wikibase');

  return (
    <Tooltip
      title={tooltipTitle}
      placement="top"
      mouseEnterDelay={0.2}
      zIndex={2100}
      getPopupContainer={(trigger) =>
        typeof document !== 'undefined' ? document.body : trigger
      }
    >
      <span className="wikibase-statement-link-trigger">
        <a
          href={wikibaseStatementUrl(statementId)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tooltipTitle}
          className="wikibase-statement-link"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <EditOutlined aria-hidden />
        </a>
      </span>
    </Tooltip>
  );
};
