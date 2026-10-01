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
        {qualifiers.map((qualifier) => (
          <SortableQualifier key={qualifier.id} qualifier={qualifier} />
        ))}
      </SortableContext>
    </DndContext>
  );
};
