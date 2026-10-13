import type { DragEndEvent } from '@dnd-kit/core';
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

import { SortableQualifier } from './sortable-qualifier';
import type { Qualifier } from '@/types/parsed/wikibase';
import { Table, Input } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import React, { ChangeEvent } from 'react';

interface SortableQualifiersProps {
  qualifiers: Qualifier[];
  statementId: string;
  deletedQualifierIds: string[];
  onQualifierDragEnd: (statementId: string, event: DragEndEvent) => void;
  deleteQualifier: (_statementId: string, qualifierId: string) => void;
  restoreQualifier: (_statementId: string, qualifierId: string) => void;
  idLookup?: Record<string, string> | null;
  isDeleted: boolean;
  editingValueWithQualifierId: string | null;
  isChangedQualifier: (qualifierId: string) => boolean;
  setEditingValueWithQualifierId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setOriginalEditingQualifierValue: React.Dispatch<
    React.SetStateAction<string>
  >;
  setCurrentEditingQualifierValue: React.Dispatch<React.SetStateAction<string>>;
  handleEditingQualifierValueChange: (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSaveQualifierEditing: () => void;
  cancelEditingQualifierValue: () => void;
  restoreOriginalQualifierValue: (qualifierId: string) => void;
}

const formatEntityId = (
  id: string,
  idLookup: Record<string, string> | null | undefined
) => {
  if (!idLookup) {
    return id;
  }
  const label = idLookup[id];
  return label ? `${label} (${id})` : id;
};

export const SortableQualifiers = ({
  qualifiers,
  statementId,
  deletedQualifierIds,
  onQualifierDragEnd,
  deleteQualifier,
  restoreQualifier,
  idLookup,
  isDeleted,
  editingValueWithQualifierId,
  isChangedQualifier,
  setEditingValueWithQualifierId,
  setOriginalEditingQualifierValue,
  setCurrentEditingQualifierValue,
  handleEditingQualifierValueChange,
  handleSaveQualifierEditing,
  cancelEditingQualifierValue,
  restoreOriginalQualifierValue,
}: SortableQualifiersProps) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const { TextArea } = Input;

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

        console.log('qualifier record.datatype:', record.datatype);

        if (record.datatype !== 'wikibase-item') {
          // ist das hier so richtig? sollen wikibase-items (qualifier) editiert werden können?
          return (
            <div>
              <span>{formatEntityId(value, idLookup)}</span>
            </div>
          );
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
