import * as React from 'react';
import Draggable1, { DraggableProps } from 'react-draggable';

// quickfix https://github.com/react-grid-layout/react-draggable/issues/652#issuecomment-1407501491
export const Draggable = Draggable1 as React.ComponentClass<
  Partial<DraggableProps>
>;

export * from 'react-draggable';
export default Draggable;
