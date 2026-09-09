import { titleIdPrefix } from '@/components/title';

const MAIN_SCROLL_CONTAINER_ID = 'main-scroll-container';

const getHeadlineElement = (headlineKey: string) => {
  try {
    return document.getElementById(
      `${titleIdPrefix}${decodeURIComponent(headlineKey)}`
    );
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const scrollToHeadline = (
  headlineKey: string,
  behavior: ScrollBehavior = 'smooth'
): boolean => {
  const element = getHeadlineElement(headlineKey);
  const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
  if (!element || !container) {
    return false;
  }

  const top =
    container.scrollTop +
    element.getBoundingClientRect().top -
    container.getBoundingClientRect().top;

  container.scrollTo({ top, left: 0, behavior });
  return true;
};

const isHeadlineAligned = (headlineKey: string) => {
  const element = getHeadlineElement(headlineKey);
  const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
  if (!element || !container) {
    return false;
  }
  return (
    Math.abs(
      element.getBoundingClientRect().top -
        container.getBoundingClientRect().top
    ) < 2
  );
};

export const keepHeadlineAligned = (
  headlineKey: string,
  {
    maxFrames = 90,
    onSettled,
  }: { maxFrames?: number; onSettled?: () => void } = {}
) => {
  const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
  let cancelled = false;
  let settled = false;
  let rafId = 0;
  let attempts = 0;
  let stableFrames = 0;
  let lastScrollHeight = container?.scrollHeight;

  const settle = () => {
    if (settled) {
      return;
    }
    settled = true;
    cancelled = true;
    cancelAnimationFrame(rafId);
    container?.removeEventListener('wheel', settle);
    container?.removeEventListener('touchmove', settle);
    onSettled?.();
  };

  const tick = () => {
    if (cancelled) {
      return;
    }
    attempts += 1;
    scrollToHeadline(headlineKey, 'auto');

    const scrollHeight = container?.scrollHeight;
    if (isHeadlineAligned(headlineKey) && scrollHeight === lastScrollHeight) {
      stableFrames += 1;
      if (stableFrames >= 5 && attempts >= 20) {
        settle();
        return;
      }
    } else {
      stableFrames = 0;
      lastScrollHeight = scrollHeight;
    }

    if (attempts < maxFrames) {
      rafId = requestAnimationFrame(tick);
    } else {
      settle();
    }
  };

  container?.addEventListener('wheel', settle, { passive: true });
  container?.addEventListener('touchmove', settle, { passive: true });
  rafId = requestAnimationFrame(tick);

  return settle;
};
