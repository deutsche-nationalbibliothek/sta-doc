import type { HTMLAttributes } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableQualifierProps extends HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
  // qualifier: Qualifier;
}

export const SortableQualifier = ({
  children,
  ...props
}: // { qualifier }:
SortableQualifierProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id:
      // qualifier.id,
      props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={
        style
        //   {
        //   ...style,
        //   display: 'flex',
        //   justifyContent: 'center',
        //   alignItems: 'center',
        //   gap: '0.3rem',
        //   border: '1px solid lightgray',
        //   borderRadius: '10px',
        //   padding: '0.3rem',
        //   margin: '0.3rem',
        //   cursor: isDragging ? 'grabbing' : 'grab',
        // }
      }
      {...attributes}
      {...listeners}
    >
      {/* <td style={{ margin: 0 }}>{qualifier.propertyId}:</td>
      <td style={{ margin: 0 }}>{qualifier.value}</td> */}
      {children}
    </tr>
  );
};
