import React, { useEffect, useRef } from 'react';
import {
  EmbedFocusProvider,
  scrollHostToEmbed,
  useEmbedFocus,
} from './embed-focus-context';
import { DocumentTipTap } from './document-tiptap';
import { FragmentFocusPanel } from './fragment-focus-panel';

export interface DocumentEditorProps {
  html: string;
  onChange: (html: string) => void;
  serverSyncKey?: string | number;
}

const DocumentEditorInner: React.FC<DocumentEditorProps> = ({
  html,
  onChange,
  serverSyncKey,
}) => {
  const {
    hostLocked,
    active,
    restoreToEntityId,
    consumeRestore,
  } = useEmbedFocus();
  const panelAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostLocked || !active) {
      return;
    }
    panelAnchorRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [hostLocked, active?.entityId]);

  useEffect(() => {
    if (hostLocked || !restoreToEntityId) {
      return;
    }
    const entityId = restoreToEntityId;
    consumeRestore();

    let cancelled = false;
    const tryScroll = () => {
      if (cancelled) {
        return;
      }
      scrollHostToEmbed(entityId);
    };

    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(tryScroll);
    });
    const timeout = window.setTimeout(tryScroll, 120);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [hostLocked, restoreToEntityId, consumeRestore]);

  return (
    <div>
      {hostLocked && active ? (
        <>
          <div ref={panelAnchorRef} />
          <FragmentFocusPanel />
        </>
      ) : (
        <DocumentTipTap
          html={html}
          onChange={onChange}
          serverSyncKey={serverSyncKey}
          editable
          showToolbar
          showSourceEscape
        />
      )}
    </div>
  );
};

/**
 * Client-only TipTap editor for DocumentValue.html.
 * Loaded via next/dynamic with ssr:false from DocumentHtmlEditor.
 */
export const DocumentEditor: React.FC<DocumentEditorProps> = (props) => {
  return (
    <EmbedFocusProvider>
      <DocumentEditorInner {...props} />
    </EmbedFocusProvider>
  );
};
