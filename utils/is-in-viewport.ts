export const isInViewport = (element: HTMLElement, container: HTMLElement) => {
  if (!element ?? !container) {
    console.debug('no element or container in isInViewport');
    return false;
  }
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return (
    elementRect.y + elementRect.height / 2 >= containerRect.y &&
    elementRect.y + elementRect.height <= containerRect.y + containerRect.height
  );
};
