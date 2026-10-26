import React from 'react';
import { Input } from 'antd';
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from '@tiptap/react';
import { BlockChrome } from './block-chrome';
import { StaCollapsible, StaExample } from './document-nodes';

function unwrapNode(editor: ReactNodeViewProps['editor'], typeName: string) {
  editor.chain().focus().lift(typeName).run();
}

export function StaCollapsibleView({
  node,
  selected,
  updateAttributes,
  deleteNode,
  editor,
}: ReactNodeViewProps) {
  const intro = (node.attrs.intro as string) || '';

  return (
    <NodeViewWrapper as="div" className="sta-container-view">
      <BlockChrome
        label="Aufklappbar"
        selected={selected}
        onDelete={() => deleteNode()}
        onUnwrap={() => unwrapNode(editor, 'staCollapsible')}
        extra={
          <Input
            size="small"
            value={intro}
            placeholder="Einführungstext (data-intro)"
            onChange={(event) =>
              updateAttributes({ intro: event.target.value || null })
            }
            onMouseDown={(event) => event.stopPropagation()}
            aria-label="Einführungstext"
          />
        }
      >
        <NodeViewContent className="sta-container-view__content" />
      </BlockChrome>
    </NodeViewWrapper>
  );
}

export function StaExampleView({
  selected,
  deleteNode,
  editor,
}: ReactNodeViewProps) {
  return (
    <NodeViewWrapper as="div" className="sta-container-view">
      <BlockChrome
        label="Beispiel"
        selected={selected}
        onDelete={() => deleteNode()}
        onUnwrap={() => unwrapNode(editor, 'staExample')}
      >
        <NodeViewContent className="sta-container-view__content" />
      </BlockChrome>
    </NodeViewWrapper>
  );
}

export const StaCollapsibleInteractive = StaCollapsible.extend({
  addNodeView() {
    return ReactNodeViewRenderer(StaCollapsibleView, {
      as: 'div',
      className: 'collapsible',
      attrs: ({ node }): Record<string, string> => {
        const intro = node.attrs.intro;
        return intro ? { 'data-intro': String(intro) } : {};
      },
    });
  },
});

export const StaExampleInteractive = StaExample.extend({
  addNodeView() {
    return ReactNodeViewRenderer(StaExampleView, {
      as: 'div',
      className: 'example',
    });
  },
});
