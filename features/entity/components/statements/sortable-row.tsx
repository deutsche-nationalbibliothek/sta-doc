import { HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface SortableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

export const SortableRow = (props: SortableRowProps) => {
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
    // cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  // Normalizes React.Children to an array regardless whether there is only a single element or multiple children.
  const cells = React.Children.toArray(props.children);

  return (
    // style
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      // style={{ ...style, cursor: isDragging ? 'grabbing' : 'grab' }}
      {...attributes}
    >
      {/* <td style={{ width: 40, textAlign: 'center' }}>
        <span
          {...listeners}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <HolderOutlined />
        </span>
      </td>
      {props.children} */}
      {React.cloneElement(
        cells[0] as React.ReactElement,
        {},
        <span
          {...listeners}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <HolderOutlined />
        </span>
      )}

      {cells.slice(1)}
    </tr>
  );
};
