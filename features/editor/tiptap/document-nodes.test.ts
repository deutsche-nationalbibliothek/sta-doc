import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { documentHtmlExtensions } from './document-nodes';
import { applyEntityLink, applyWebLink, linkKindOf } from './link-helpers';

function createEditor(content: string) {
  return new Editor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        link: false,
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      ...documentHtmlExtensions,
    ],
    content,
  });
}

describe('documentHtml TipTap nodes', () => {
  it('round-trips collapsible, example, embed and ref link', () => {
    const html =
      '<p>Intro</p>' +
      '<div class="collapsible" data-intro="Mehr">' +
      '<p>Details <strong>fett</strong></p>' +
      '<div class="embed" data-entity-id="Q200" data-embed-property="P396"></div>' +
      '</div>' +
      '<div class="example"><p>Beispieltext</p></div>' +
      '<p><a class="ref" href="Q100" data-entity-id="Q100">Label</a></p>';

    const editor = createEditor(html);
    const out = editor.getHTML();
    editor.destroy();

    expect(out).toContain('class="collapsible"');
    expect(out).toContain('data-intro="Mehr"');
    expect(out).toContain('class="embed"');
    expect(out).toContain('data-entity-id="Q200"');
    expect(out).toContain('data-embed-property="P396"');
    expect(out).toContain('class="example"');
    expect(out).toContain('data-entity-id="Q100"');
    expect(out).toContain('<strong>fett</strong>');
  });

  it('round-trips P132 lang passage wrapper', () => {
    const html =
      '<div lang="en" data-original-language="Q318"><p>English passage</p></div>';
    const editor = createEditor(html);
    const out = editor.getHTML();
    editor.destroy();

    expect(out).toContain('lang="en"');
    expect(out).toContain('data-original-language="Q318"');
    expect(out).toContain('English passage');
    expect(out).not.toMatch(/class="[^"]*collapsible/);
  });

  it('preserves paragraph original-language attributes', () => {
    const html =
      '<p lang="en" data-original-language="Q318">English passage</p>';
    const editor = createEditor(html);
    const out = editor.getHTML();
    editor.destroy();

    expect(out).toContain('lang="en"');
    expect(out).toContain('data-original-language="Q318"');
    expect(out).toContain('English passage');
  });

  it('round-trips a.see with data-entity-id', () => {
    const html =
      '<p>Text <a class="see" href="Q55" data-entity-id="Q55">Q55</a></p>';
    const editor = createEditor(html);
    const out = editor.getHTML();
    editor.destroy();

    expect(out).toContain('class="see"');
    expect(out).toContain('data-entity-id="Q55"');
  });

  it('distinguishes web, ref and see links via helpers', () => {
    const editor = createEditor('<p>hello world</p>');
    editor.commands.setTextSelection({ from: 1, to: 6 });
    applyWebLink(editor, 'https://example.org');
    expect(linkKindOf(editor)).toBe('web');
    expect(editor.getHTML()).toContain('href="https://example.org"');
    expect(editor.getHTML()).not.toContain('class="ref"');

    editor.commands.selectAll();
    applyEntityLink(editor, 'ref', 'Q100', 'Label');
    expect(linkKindOf(editor)).toBe('ref');
    expect(editor.getHTML()).toContain('class="ref"');
    expect(editor.getHTML()).toContain('data-entity-id="Q100"');

    applyEntityLink(editor, 'see', 'P11', 'P11');
    expect(linkKindOf(editor)).toBe('see');
    expect(editor.getHTML()).toContain('class="see"');
    expect(editor.getHTML()).toContain('data-entity-id="P11"');

    editor.destroy();
  });
});
