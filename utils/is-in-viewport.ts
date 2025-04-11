export const isInViewport = (element: HTMLElement, container: HTMLElement) => {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return (
    elementRect.y + elementRect.height / 2 >= containerRect.y &&
    elementRect.y + elementRect.height <= containerRect.y + containerRect.height
  );
};
