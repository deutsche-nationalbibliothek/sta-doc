import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import type { Extensions } from '@tiptap/core';
import { documentHtmlBaseExtensions } from './document-nodes';
import {
  StaCollapsible,
  StaExample,
  StaEmbed,
} from './document-nodes';
import {
  StaCollapsibleInteractive,
  StaExampleInteractive,
} from './container-node-views';
import { StaEmbedInteractive } from './embed-node-view';
import { staTableExtensions } from './document-table-extensions';

export type DocumentEditorExtensionOptions = {
  /** Host document: interactive embed/collapsible/example chrome. */
  interactiveContainers?: boolean;
  placeholder?: string;
};

/**
 * TipTap schema for DocumentValue.html (SAFELIST_TEXT-compatible flow content + tables).
 */
export function createDocumentHtmlEditorExtensions(
  options: DocumentEditorExtensionOptions = {}
): Extensions {
  const {
    interactiveContainers = true,
    placeholder = 'Fließtext bearbeiten…',
  } = options;

  const containers = interactiveContainers
    ? [StaCollapsibleInteractive, StaExampleInteractive, StaEmbedInteractive]
    : [StaCollapsible, StaExample, StaEmbed];

  return [
    StarterKit.configure({
      paragraph: false,
      link: false,
      heading: { levels: [1, 2, 3] },
      codeBlock: false,
      blockquote: false,
      horizontalRule: false,
    }),
    Placeholder.configure({ placeholder }),
    ...documentHtmlBaseExtensions,
    ...containers,
    ...staTableExtensions,
  ];
}
