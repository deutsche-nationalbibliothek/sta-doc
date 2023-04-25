import { useEffect, useState } from 'react';

type Listener<T> = (this: Document, ev: CustomEvent<T>) => void;

const useCustomEvent = <T>(
  eventName: string,
  listener: Listener<T> = () => {
    /* no-op */
  }
) => {
  useEffect(() => {
    document.addEventListener(eventName, listener);
    return () => document.removeEventListener(eventName, listener);
  }, [eventName, listener]);

  const publish = (data: T) => {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  };

  return { publish };
};

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
      setIsOpen((isOpen) => {
        publish(!isOpen ? 'open' : 'close');
        return !isOpen;
      });
    },
    state: isOpen,
  };
};
