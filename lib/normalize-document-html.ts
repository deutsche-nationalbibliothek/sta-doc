/**
 * Strip TipTap/table-editor layout noise before persist or API submit.
 * Mirrors {@link de.dnb.sta.storage.entry.DocumentHtml#normalizeEditorTableArtifacts}.
 */
export function normalizeDocumentHtmlForPersist(html: string): string {
  if (html == null || html.trim() === '') {
    return html ?? '';
  }

  const doc = new DOMParser().parseFromString(
    `<body>${html}</body>`,
    'text/html',
  );
  const body = doc.body;

  body.querySelectorAll('colgroup').forEach((el) => el.remove());

  body.querySelectorAll('div.tableWrapper').forEach((wrapper) => {
    const parent = wrapper.parentNode;
    if (!parent) {
      return;
    }
    while (wrapper.firstChild) {
      parent.insertBefore(wrapper.firstChild, wrapper);
    }
    wrapper.remove();
  });

  body.querySelectorAll('table, td, th, tr, col').forEach((el) => {
    el.removeAttribute('style');
    el.removeAttribute('colwidth');
    el.removeAttribute('data-colwidth');
  });

  body.querySelectorAll('td, th').forEach((cell) => {
    if (cell.getAttribute('colspan') === '1') {
      cell.removeAttribute('colspan');
    }
    if (cell.getAttribute('rowspan') === '1') {
      cell.removeAttribute('rowspan');
    }
  });

  return body.innerHTML;
}
