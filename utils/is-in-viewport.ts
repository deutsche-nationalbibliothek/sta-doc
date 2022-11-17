export const isInViewport = (
  element: HTMLElement,
  container = document.documentElement
) => {
  if (!element) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -60 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || container.clientHeight) &&
    rect.right <= (window.innerWidth || container.clientWidth)
  );
};
