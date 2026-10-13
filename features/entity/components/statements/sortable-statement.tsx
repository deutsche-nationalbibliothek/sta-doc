import React from 'react';
import { HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableStatementProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

// Sortable table row for the Ant Design `Table`, built on dnd-kit. The content of the first cell is replaced by a drag handle. Only the handle starts a drag. Must be used inside a `DndContext` and `SortableContext`.

// Example: <Table rowKey="key" components={{ body: { row: SortableRow } }} ... />

export const SortableStatement = (props: SortableStatementProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    // Keep the dragged row above the others
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  // Normalizes React.Children to an array regardless whether there is only a single element or multiple children.
  const cells = React.Children.toArray(props.children);

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {/* Replace the content of the first cell with the drag handle */}
      {React.cloneElement(
        cells[0] as React.ReactElement,
        {},
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span
            {...listeners}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            <HolderOutlined />
          </span>
        </div>
      )}
      {/* Render all remaining cells unchanged. */}
      {cells.slice(1)}
    </tr>
  );
};
