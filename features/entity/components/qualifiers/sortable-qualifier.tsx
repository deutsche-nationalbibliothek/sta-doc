import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Qualifier } from '@/types/parsed/wikibase';

interface SortableQualifierProps {
  qualifier: Qualifier;
}

export const SortableQualifier = ({ qualifier }: SortableQualifierProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: qualifier.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.3rem',
        border: '1px solid lightgray',
        borderRadius: '10px',
        padding: '0.3rem',
        margin: '0.3rem',
      }}
      {...attributes}
      {...listeners}
    >
      <p style={{ margin: 0 }}>{qualifier.propertyId}:</p>
      <p style={{ margin: 0 }}>{qualifier.value}</p>
    </div>
  );
};
