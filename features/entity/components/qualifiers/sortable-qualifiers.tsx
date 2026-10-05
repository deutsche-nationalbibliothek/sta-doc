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
}

export const SortableQualifiers = ({
  qualifiers,
  statementId,
  onQualifierDragEnd,
}: SortableQualifiersProps) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const columns = [
    {
      title: 'Property',
      dataIndex: 'propertyId',
      key: 'propertyId',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
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
