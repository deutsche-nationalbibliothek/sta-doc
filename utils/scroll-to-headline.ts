import { titleIdPrefix } from '@/components/title';

export const scrollToHeadline = (headlineKey: string) => {
  try {
    const element = document.getElementById(
      `${titleIdPrefix}${decodeURIComponent(headlineKey)}`
    );
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (e) {
    console.error(e);
  }
};
