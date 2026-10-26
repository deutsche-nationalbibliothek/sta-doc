import type { Editor } from '@tiptap/react';

export type StaLinkKind = 'web' | 'ref' | 'see';

export function linkKindOf(editor: Editor): StaLinkKind | null {
  if (!editor.isActive('link')) {
    return null;
  }
  const attrs = editor.getAttributes('link');
  const className = (attrs.class as string | null) || '';
  if (className.split(/\s+/).includes('see')) {
    return 'see';
  }
  if (className.split(/\s+/).includes('ref')) {
    return 'ref';
  }
  return 'web';
}

type StaLinkAttrs = {
  href: string;
  class?: string | null;
  entityId?: string | null;
};

export function applyWebLink(editor: Editor, href: string) {
  const attrs: StaLinkAttrs = {
    href,
    class: null,
    entityId: null,
  };
  editor
    .chain()
    .focus()
    .extendMarkRange('link')
    // StaLink extends Link with class + entityId; TipTap's setLink typings omit them.
    .setLink(attrs as { href: string })
    .run();
}

export function applyEntityLink(
  editor: Editor,
  kind: 'ref' | 'see',
  entityId: string,
  displayLabel?: string
) {
  const id = entityId.trim();
  const attrs: StaLinkAttrs = {
    href: id,
    class: kind,
    entityId: id,
  };

  if (editor.state.selection.empty) {
    const text = displayLabel?.trim() || id;
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'text',
        text,
        marks: [{ type: 'link', attrs }],
      })
      .run();
    return;
  }

  editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink(attrs as { href: string })
    .run();
}

export function clearLink(editor: Editor) {
  editor.chain().focus().extendMarkRange('link').unsetLink().run();
}
