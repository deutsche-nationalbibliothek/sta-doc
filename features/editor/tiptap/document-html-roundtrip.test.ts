import { Editor } from '@tiptap/core';
import { createDocumentHtmlEditorExtensions } from './document-editor-extensions';

function roundTrip(html: string, interactiveContainers = true): string {
  const editor = new Editor({
    extensions: createDocumentHtmlEditorExtensions({ interactiveContainers }),
    content: html,
  });
  const out = editor.getHTML();
  editor.destroy();
  return out;
}

describe('DocumentValue HTML table round-trip', () => {
  it('preserves a simple table with colspan', () => {
    const input =
      '<table summary="Beispiel"><tbody><tr><th scope="col">Feld</th><th>Wert</th></tr><tr><td>A</td><td colspan="2">B</td></tr></tbody></table>';
    const output = roundTrip(input);
    expect(output).toContain('<table');
    expect(output).toContain('summary="Beispiel"');
    expect(output).toContain('colspan="2"');
    expect(output).toContain('>A<');
    expect(output).toContain('>B<');
  });

  it('preserves thead header row markup', () => {
    const input =
      '<table><thead><tr><th scope="col">Spalte</th></tr></thead><tbody><tr><td>Inhalt</td></tr></tbody></table>';
    const output = roundTrip(input);
    expect(output).toMatch(/<th[^>]*scope="col"/);
    expect(output).toContain('>Inhalt<');
  });

  it('preserves tables inside div.example', () => {
    const input =
      '<div class="example"><table><tbody><tr><td>1</td><td>2</td></tr></tbody></table></div>';
    const output = roundTrip(input);
    expect(output).toContain('class="example"');
    expect(output).toContain('<table');
    expect(output).toContain('>1<');
    expect(output).toContain('>2<');
  });

  it('round-trips rich-html mode without STA container nodes', () => {
    const input =
      '<table width="100%"><tbody><tr><td abbr="x" width="40">Cell</td></tr></tbody></table>';
    const output = roundTrip(input, false);
    expect(output).toContain('width="100%"');
    expect(output).toContain('abbr="x"');
    expect(output).toContain('>Cell<');
  });
});
