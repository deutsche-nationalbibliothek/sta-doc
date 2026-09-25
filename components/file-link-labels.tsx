import { useEffect } from 'react';

export default function FileLinkLabels() {
  useEffect(() => {
    document
      .querySelectorAll<HTMLAnchorElement>('a[href*=".pdf"], a[href*=".pptx"]')
      .forEach((link) => {
        const text = link.textContent ?? '';

        if (/\bPDF\b/i.test(text)) {
          link.classList.add('has-pdf-label');
        }

        if (/\bPPTX?\b/i.test(text)) {
          link.classList.add('has-ppt-label');
        }
      });
  }, []);

  return null;
}
