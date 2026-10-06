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

interface SortableQualifiersProps {
  qualifiers: Qualifier[];
  statementId: string;
  onQualifierDragEnd: (statementId: string, event: DragEndEvent) => void;
  idLookup?: Record<string, string> | null;
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
  onQualifierDragEnd,
  idLookup,
}: SortableQualifiersProps) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const columns = [
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
        record.datatype === 'string'
          ? value
          : formatEntityId(value, idLookup),
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
        {/* {qualifiers.map((qualifier) => (
          <SortableQualifier key={qualifier.id} qualifier={qualifier} />
        ))} */}
        <Table
          columns={columns}
          dataSource={qualifiers}
          rowKey="id"
          pagination={false}
          components={{
            body: {
              row: SortableQualifier,
            },
          }}
        />
      </SortableContext>
    </DndContext>
  );
};
