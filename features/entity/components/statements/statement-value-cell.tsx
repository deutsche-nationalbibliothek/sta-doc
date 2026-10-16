import useTranslation from 'next-translate/useTranslation';

import { Input, Tooltip } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  RollbackOutlined,
} from '@ant-design/icons';

import { useWikibaseEditorContext } from '@/features/entity/context/wikibase-editor-context';
import { formatEntityId } from '@/utils/format-entity-id';
import { WikibaseStatementLink } from '@/features/entity/components/statements/wikibase-statement-link';

import type { ParsedStatement } from '@/types/parsed/wikibase';

interface StatementValueCellProps {
  value: string;
  record: ParsedStatement;
  isDeleted: boolean;
}

export const StatementValueCell = ({
  value,
  record,
  isDeleted,
}: StatementValueCellProps) => {
  const { t } = useTranslation('wikibase');
  const { TextArea } = Input;

  const {
    idLookup,
    editingValueWithStatementId,
    handleEditingStatementValueChange,
    handleSaveStatementEditing,
    cancelEditingStatementValue,
    isChangedStatement,
    restoreOriginalStatementValue,
    setEditingValueWithStatementId,
    setOriginalEditingStatementValue,
    setCurrentEditingStatementValue,
  } = useWikibaseEditorContext();

  // Deleted statements are displayed without editing actions.
  if (isDeleted) {
    return value;
  }

  const opener = <WikibaseStatementLink statementKey={record.key} />;

  if (record.datatype !== 'string') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span>{formatEntityId(value, idLookup)}</span>
        {opener}
      </span>
    );
  }

  // Show the input field and save/cancel actions while editing.
  if (editingValueWithStatementId === record.statementId) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TextArea
          rows={4}
          defaultValue={value}
          autoFocus
          onChange={handleEditingStatementValueChange}
        />
        <Tooltip title={t('table.save')}>
          <CheckOutlined
            onClick={handleSaveStatementEditing}
            style={{ cursor: 'pointer' }}
          />
        </Tooltip>
        <Tooltip title={t('table.cancel')}>
          <CloseOutlined
            onClick={cancelEditingStatementValue}
            style={{ cursor: 'pointer' }}
          />
        </Tooltip>
        {opener}
      </div>
    );
  }

  if (isChangedStatement(record.statementId)) {
    return (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {value}
        <Tooltip title={t('table.edit')}>
          <EditOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setEditingValueWithStatementId(record.statementId);
              setOriginalEditingStatementValue(value);
              setCurrentEditingStatementValue(value);
            }}
          />
        </Tooltip>
        <Tooltip title={t('table.restore')}>
          <RollbackOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => {
              restoreOriginalStatementValue(record.statementId);
            }}
          />
        </Tooltip>
        {opener}
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      {value}
      <Tooltip title={t('table.edit')}>
        <EditOutlined
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setEditingValueWithStatementId(record.statementId);
            setOriginalEditingStatementValue(value);
            setCurrentEditingStatementValue(value);
          }}
        />
      </Tooltip>
      {opener}
    </span>
  );
};
