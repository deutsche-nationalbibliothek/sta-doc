import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import useTranslation from 'next-translate/useTranslation';

import { Input, Table, Tooltip } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import type { Qualifier } from '@/types/parsed/wikibase';
import { SortableQualifier } from '@/features/entity/components/qualifiers/sortable-qualifier';
import { QualifierValueCell } from '@/features/entity/components/qualifiers/qualifier-value-cell';
import { formatEntityId } from '@/utils/format-entity-id';
import { EntitySelect } from '@/features/entity/components/entity-select';
import { useWikibaseEditorContext } from '@/features/entity/context/wikibase-editor-context';

interface QualifierTableProps {
  qualifiers: Qualifier[];
  statementId: string;
  isDeleted: boolean; // whole statement is deleted
}

// Datatypes that can be edited. Everything else: read-only.
const editableDatatypes = ['string', 'wikibase-item'];

export const QualifierTable = ({
  qualifiers,
  statementId,
  isDeleted,
}: QualifierTableProps) => {
  const { t } = useTranslation('wikibase');

  const {
    idLookup,
    deletedQualifierIds,
    onQualifierDragEnd,
    deleteQualifier,
    restoreQualifier,
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

  const sensors = useSensors(useSensor(PointerSensor));

  const { TextArea } = Input;

  const qualifierColumns: ColumnsType<Qualifier> = [
    { title: '', key: 'drag-handle', width: 40, render: () => null },
    {
      title: t('table.property'),
      dataIndex: 'propertyId',
      key: 'propertyId',
      render: (propertyId: string) => formatEntityId(propertyId, idLookup),
    },
    {
      title: t('table.value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: string, record: Qualifier) => (
        <QualifierValueCell value={value} record={record} />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 40,
      render: (_value: string, record: Qualifier) => {
        // If the whole statement is deleted, there are no actions available anymore.
        if (isDeleted) {
          return null;
        }

        return deletedQualifierIds.includes(record.id) ? (
          <Tooltip title={t('table.restoreDeleted')}>
            <RollbackOutlined
              onClick={() => {
                restoreQualifier(statementId, record.id);
              }}
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={t('table.delete')}>
            <DeleteOutlined
              onClick={() => {
                deleteQualifier(statementId, record.id);
              }}
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={(event) => {
        onQualifierDragEnd(statementId, event);
      }}
    >
      <SortableContext
        items={qualifiers.map((qualifier) => qualifier.id)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          columns={qualifierColumns}
          dataSource={qualifiers}
          rowKey="id"
          pagination={false}
          components={{
            body: {
              row: SortableQualifier,
            },
          }}
          showHeader={false}
          rowClassName={(record) =>
            isDeleted || deletedQualifierIds.includes(record.id)
              ? 'row-deleted'
              : isChangedQualifier(record.id)
              ? 'row-changed'
              : ''
          }
        />
      </SortableContext>
    </DndContext>
  );
};
