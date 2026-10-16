import useTranslation from 'next-translate/useTranslation';

import { Input, Tooltip } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  RollbackOutlined,
} from '@ant-design/icons';

import { EntitySelect } from '@/features/entity/components/entity-select';
import { formatEntityId } from '@/utils/format-entity-id';
import { useWikibaseEditorContext } from '@/features/entity/context/wikibase-editor-context';

import type { Qualifier } from '@/types/parsed/wikibase';

interface QualifierValueCellProps {
  value: string;
  record: Qualifier;
}

// Datatypes that can be edited. Everything else: read-only.
const editableDatatypes = ['string', 'wikibase-item'];

export const QualifierValueCell = ({
  value,
  record,
}: QualifierValueCellProps) => {
  const { t } = useTranslation('wikibase');
  const { TextArea } = Input;

  const {
    idLookup,
    editingValueWithQualifierId,
    isChangedQualifier,
    setEditingValueWithQualifierId,
    setOriginalEditingQualifierValue,
    setCurrentEditingQualifierValue,
    handleEditingQualifierValueChange,
    handleSaveQualifierEditing,
    cancelEditingQualifierValue,
    restoreOriginalQualifierValue,
  } = useWikibaseEditorContext();

  const isItem = record.datatype === 'wikibase-item';

  // Items are stored as IDs (for instance "Q5"), but shown with their label.
  const displayValue = isItem ? formatEntityId(value, idLookup) : value;

  if (!editableDatatypes.includes(record.datatype)) {
    return <span>{displayValue}</span>;
  }

  // Show the appropriate input depending on the qualifier datatype.
  if (editingValueWithQualifierId === record.id) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isItem ? (
          <EntitySelect
            defaultValue={value}
            onSelect={setCurrentEditingQualifierValue}
          />
        ) : (
          <TextArea
            rows={4}
            defaultValue={value}
            autoFocus
            onChange={handleEditingQualifierValueChange}
          />
        )}
        <Tooltip title={t('table.save')}>
          <CheckOutlined
            onClick={handleSaveQualifierEditing}
            style={{ cursor: 'pointer' }}
          />
        </Tooltip>
        <Tooltip title={t('table.cancel')}>
          <CloseOutlined
            onClick={cancelEditingQualifierValue}
            style={{ cursor: 'pointer' }}
          />
        </Tooltip>
      </div>
    );
  }

  if (isChangedQualifier(record.id)) {
    return (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {displayValue}
        <Tooltip title={t('table.edit')}>
          <EditOutlined
            onClick={() => {
              setEditingValueWithQualifierId(record.id);
              setOriginalEditingQualifierValue(value);
              setCurrentEditingQualifierValue(value);
            }}
            style={{ cursor: 'pointer' }}
          />
        </Tooltip>
        <Tooltip title={t('table.restore')}>
          <RollbackOutlined
            onClick={() => {
              restoreOriginalQualifierValue(record.id);
            }}
            style={{ cursor: 'pointer' }}
          />
        </Tooltip>
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
      {displayValue}
      <Tooltip title={t('table.edit')}>
        <EditOutlined
          onClick={() => {
            setEditingValueWithQualifierId(record.id);
            setOriginalEditingQualifierValue(value);
            setCurrentEditingQualifierValue(value);
          }}
          style={{ cursor: 'pointer' }}
        />
      </Tooltip>
    </span>
  );
};
