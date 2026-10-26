import type { Editor } from '@tiptap/react';
import { NodeSelection } from '@tiptap/pm/state';

export type LayoutBlockType = 'staEmbed' | 'staCollapsible' | 'staExample';

export function activeLayoutBlock(editor: Editor): LayoutBlockType | null {
  if (editor.isActive('staEmbed')) {
    return 'staEmbed';
  }
  if (editor.isActive('staCollapsible')) {
    return 'staCollapsible';
  }
  if (editor.isActive('staExample')) {
    return 'staExample';
  }
  return null;
}

function deleteNodeOfType(editor: Editor, typeName: LayoutBlockType): boolean {
  const { selection } = editor.state;

  if (
    selection instanceof NodeSelection &&
    selection.node.type.name === typeName
  ) {
    return editor.chain().focus().deleteSelection().run();
  }

  const $pos = selection.$from;
  for (let depth = $pos.depth; depth > 0; depth--) {
    if ($pos.node(depth).type.name === typeName) {
      const from = $pos.before(depth);
      const to = $pos.after(depth);
      return editor.chain().focus().deleteRange({ from, to }).run();
    }
  }

  const after = $pos.nodeAfter;
  if (after?.type.name === typeName) {
    const from = $pos.pos;
    return editor
      .chain()
      .focus()
      .deleteRange({ from, to: from + after.nodeSize })
      .run();
  }

  const before = $pos.nodeBefore;
  if (before?.type.name === typeName) {
    const to = $pos.pos;
    return editor
      .chain()
      .focus()
      .deleteRange({ from: to - before.nodeSize, to })
      .run();
  }

  return false;
}

/**
 * Removes the active layout block:
 * - embed: delete atom
 * - collapsible / example: lift frame, keep inner content
 */
export function removeActiveLayoutBlock(editor: Editor): boolean {
  const type = activeLayoutBlock(editor);
  if (!type) {
    return false;
  }
  if (type === 'staEmbed') {
    return deleteNodeOfType(editor, 'staEmbed');
  }
  return editor.chain().focus().lift(type).run();
}

/** Deletes collapsible/example including content (and embed). */
export function deleteActiveLayoutBlock(editor: Editor): boolean {
  const type = activeLayoutBlock(editor);
  if (!type) {
    return false;
  }
  return deleteNodeOfType(editor, type);
}
