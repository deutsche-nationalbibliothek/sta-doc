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
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { Input, Table } from 'antd';

import { SortableQualifier } from './sortable-qualifier';

import { formatEntityId } from '@/utils/format-entity-id';
import { useWikibaseEditorContext } from '@/features/entity/context/wikibase-editor-context';

import type { Qualifier } from '@/types/parsed/wikibase';

interface QualifierTableProps {
  qualifiers: Qualifier[];
  statementId: string;
  isDeleted: boolean;
}

const { TextArea } = Input;

export const QualifierTable = ({
  qualifiers,
  statementId,
  isDeleted,
}: QualifierTableProps) => {
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

  const qualifierColumns = [
    { title: '', key: 'drag-handle', width: 40, render: () => null },
    {
      title: 'Property',
      dataIndex: 'propertyId',
      key: 'propertyId',
      render: (propertyId: string) => formatEntityId(propertyId, idLookup),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: string, record: Qualifier) => {
        // record.datatype === 'string' ? value : formatEntityId(value, idLookup);

        if (
          record.datatype === 'wikibase-item' ||
          record.datatype === 'wikibase-property'
        ) {
          return <span>{formatEntityId(value, idLookup)}</span>;
        }

        if (record.datatype !== 'string') {
          return <span>{value}</span>;
        }

        if (editingValueWithQualifierId === record.id) {
          return (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <TextArea
                rows={4}
                defaultValue={value}
                autoFocus
                onChange={handleEditingQualifierValueChange}
              />
              <CheckOutlined
                onClick={handleSaveQualifierEditing}
                style={{ cursor: 'pointer' }}
              />
              <CloseOutlined
                onClick={cancelEditingQualifierValue}
                style={{ cursor: 'pointer' }}
              />
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
              {value}
              <EditOutlined
                onClick={() => {
                  setEditingValueWithQualifierId(record.id);
                  setOriginalEditingQualifierValue(value);
                  setCurrentEditingQualifierValue(value);
                }}
                style={{ cursor: 'pointer' }}
              />
              <RollbackOutlined
                onClick={() => {
                  restoreOriginalQualifierValue(record.id);
                }}
                style={{ cursor: 'pointer' }}
              />
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
            <EditOutlined
              onClick={() => {
                setEditingValueWithQualifierId(record.id);
                setOriginalEditingQualifierValue(value);
                setCurrentEditingQualifierValue(value);
              }}
              style={{ cursor: 'pointer' }}
            />
          </span>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 40,
      render: (_value: string, record: Qualifier) => {
        // falls das ganze Statement gelöscht ist, gibt es keine Actions
        if (isDeleted) {
          return null;
        }

        return deletedQualifierIds.includes(record.id) ? (
          <RollbackOutlined
            onClick={() => {
              restoreQualifier(statementId, record.id);
            }}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <DeleteOutlined
            onClick={() => {
              deleteQualifier(statementId, record.id);
            }}
            style={{ cursor: 'pointer' }}
          />
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
