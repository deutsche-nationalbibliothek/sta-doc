import { useEffect } from 'react';

export default function FileLinkLabels() {
  useEffect(() => {
    const updateFileLabels = () => {
      document
        .querySelectorAll<HTMLAnchorElement>(
          'a[href*=".pdf"], a[href*=".pptx"]'
        )
        .forEach((link) => {
          const text = link.textContent ?? '';

          if (/\bpdf\b/i.test(text)) {
            link.classList.add('has-pdf-label');
          }

          if (/\bpowerpoint\b/i.test(text)) {
            link.classList.add('has-ppt-label');
          }
        });
    };

    updateFileLabels(); // call directly to detect links when page is loaded

    const observer = new MutationObserver(updateFileLabels); // MutionOberserver is able to observe the DOM and determine if something is being added, removed, or changed.

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect(); // cleanup function auf
    };
  }, []);

  return null;
}
