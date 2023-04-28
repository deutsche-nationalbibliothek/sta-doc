import { useEffect } from 'react';

export type Listener<T> = (this: Document, ev: CustomEvent<T>) => void;

export const useCustomEvent = <T>(
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
