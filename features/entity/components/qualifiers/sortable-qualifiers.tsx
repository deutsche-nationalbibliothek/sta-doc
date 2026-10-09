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
import { Table } from 'antd';
import { DeleteOutlined, RollbackOutlined } from '@ant-design/icons';

interface SortableQualifiersProps {
  qualifiers: Qualifier[];
  statementId: string;
  deletedQualifierIds: string[];
  onQualifierDragEnd: (statementId: string, event: DragEndEvent) => void;
  deleteQualifier: (_statementId: string, qualifierId: string) => void;
  restoreQualifier: (_statementId: string, qualifierId: string) => void;
  idLookup?: Record<string, string> | null;
  isDeleted: boolean;
  isChanged: boolean;
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
  isChanged,
}: SortableQualifiersProps) => {
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
      render: (value: string, record: Qualifier) =>
        record.datatype === 'string' ? value : formatEntityId(value, idLookup),
    },
    {
      title: '',
      key: 'actions',
      width: 40,
      render: (value: string, record: Qualifier) => {
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
              : isChanged
              ? 'row-changed'
              : ''
          }
        />
      </SortableContext>
    </DndContext>
  );
};
