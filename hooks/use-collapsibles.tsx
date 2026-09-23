import { useState } from 'react';

import { Listener, useCustomEvent } from './use-custom-events';
export const useCollapseToggleEvent = (
  listener?: Listener<'open' | 'close'>
) => {
  const [isOpen, setIsOpen] = useState(true);

  const { publish } = useCustomEvent<'open' | 'close'>(
    'collapse-toggle-event',
    listener
  );
  return {
    onNextState: () => {
      const nextState = !isOpen;
      setIsOpen(nextState);
      publish(nextState ? 'open' : 'close');
    },
    state: isOpen,
  };
};
