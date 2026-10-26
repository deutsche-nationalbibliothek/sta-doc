import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { documentHtmlExtensions } from './document-nodes';
import {
  activeLayoutBlock,
  deleteActiveLayoutBlock,
  removeActiveLayoutBlock,
} from './layout-block-helpers';

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

describe('layout-block-helpers', () => {
  it('unwraps collapsible and keeps inner content', () => {
    const editor = createEditor(
      '<div class="collapsible" data-intro="Mehr"><p>Details</p></div>'
    );
    // Cursor inside the paragraph inside collapsible
    editor.commands.setTextSelection(2);
    expect(activeLayoutBlock(editor as never)).toBe('staCollapsible');
    expect(removeActiveLayoutBlock(editor as never)).toBe(true);
    const html = editor.getHTML();
    expect(html).toContain('Details');
    expect(html).not.toContain('collapsible');
    editor.destroy();
  });

  it('deletes example including content', () => {
    const editor = createEditor(
      '<p>Before</p><div class="example"><p>Beispieltext</p></div><p>After</p>'
    );
    editor.commands.setTextSelection(10);
    expect(activeLayoutBlock(editor as never)).toBe('staExample');
    expect(deleteActiveLayoutBlock(editor as never)).toBe(true);
    const html = editor.getHTML();
    expect(html).toContain('Before');
    expect(html).toContain('After');
    expect(html).not.toContain('Beispieltext');
    expect(html).not.toContain('example');
    editor.destroy();
  });

  it('deletes embed atom', () => {
    const editor = createEditor(
      '<p>X</p><div class="embed" data-entity-id="Q200" data-embed-property="P396"></div><p>Y</p>'
    );
    // Position after first paragraph, on/at embed
    const embedPos = editor.state.doc.content.firstChild!.nodeSize;
    editor.commands.setNodeSelection(embedPos);
    expect(activeLayoutBlock(editor as never)).toBe('staEmbed');
    expect(deleteActiveLayoutBlock(editor as never)).toBe(true);
    const html = editor.getHTML();
    expect(html).not.toContain('embed');
    expect(html).toContain('X');
    expect(html).toContain('Y');
    editor.destroy();
  });
});
