import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface EmbedFocusFrame {
  entityId: string;
  title?: string;
}

interface EmbedFocusContextValue {
  /** Focus stack; top entry is the active fragment editor. */
  stack: EmbedFocusFrame[];
  active: EmbedFocusFrame | null;
  hostLocked: boolean;
  /** Bumped after fragment save so host previews remount/refetch. */
  previewEpoch: number;
  bumpPreview: () => void;
  /**
   * Host embed to scroll back to after leaving fragment mode
   * (the entity that was first opened from the host).
   */
  restoreToEntityId: string | null;
  consumeRestore: () => void;
  /** Start or deepen focused edit (Q2 → Q3 pushes). */
  beginFocus: (frame: EmbedFocusFrame) => void;
  /** Leave current fragment (pop). Clears host lock when stack empty. */
  endFocus: () => void;
  /** Jump back to a stack index (inclusive); discards deeper frames. */
  popTo: (index: number) => void;
  clearFocus: () => void;
}

const EmbedFocusContext = createContext<EmbedFocusContextValue | null>(null);

export const EmbedFocusProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [stack, setStack] = useState<EmbedFocusFrame[]>([]);
  const [previewEpoch, setPreviewEpoch] = useState(0);
  const [restoreToEntityId, setRestoreToEntityId] = useState<string | null>(
    null
  );
  /** First host embed opened for this focus session. */
  const hostAnchorEntityIdRef = useRef<string | null>(null);

  const bumpPreview = useCallback(() => {
    setPreviewEpoch((value) => value + 1);
  }, []);

  const beginFocus = useCallback((frame: EmbedFocusFrame) => {
    const entityId = frame.entityId.trim();
    if (!entityId) {
      return;
    }
    setStack((prev) => {
      if (prev.length === 0) {
        hostAnchorEntityIdRef.current = entityId;
      }
      const existing = prev.findIndex((item) => item.entityId === entityId);
      if (existing >= 0) {
        return prev.slice(0, existing + 1);
      }
      return [...prev, { ...frame, entityId }];
    });
  }, []);

  const endFocus = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const popTo = useCallback((index: number) => {
    setStack((prev) => {
      if (index < 0) {
        return [];
      }
      return prev.slice(0, index + 1);
    });
  }, []);

  const clearFocus = useCallback(() => setStack([]), []);

  const consumeRestore = useCallback(() => {
    setRestoreToEntityId(null);
  }, []);

  // When the focus stack empties, hand the host anchor to the restore flow.
  useEffect(() => {
    if (stack.length > 0) {
      return;
    }
    const anchor = hostAnchorEntityIdRef.current;
    if (!anchor) {
      return;
    }
    hostAnchorEntityIdRef.current = null;
    setRestoreToEntityId(anchor);
  }, [stack.length]);

  const value = useMemo<EmbedFocusContextValue>(
    () => ({
      stack,
      active: stack.length ? stack[stack.length - 1] : null,
      hostLocked: stack.length > 0,
      previewEpoch,
      bumpPreview,
      restoreToEntityId,
      consumeRestore,
      beginFocus,
      endFocus,
      popTo,
      clearFocus,
    }),
    [
      stack,
      previewEpoch,
      bumpPreview,
      restoreToEntityId,
      consumeRestore,
      beginFocus,
      endFocus,
      popTo,
      clearFocus,
    ]
  );

  return (
    <EmbedFocusContext.Provider value={value}>
      {children}
    </EmbedFocusContext.Provider>
  );
};

export function useEmbedFocus(): EmbedFocusContextValue {
  const ctx = useContext(EmbedFocusContext);
  if (!ctx) {
    throw new Error('useEmbedFocus requires EmbedFocusProvider');
  }
  return ctx;
}

/** Safe for NodeViews that may render outside the provider during tests. */
export function useEmbedFocusOptional(): EmbedFocusContextValue | null {
  return useContext(EmbedFocusContext);
}

/** Scroll host TipTap to the embed card that started fragment mode. */
export function scrollHostToEmbed(entityId: string): boolean {
  const escaped =
    typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(entityId)
      : entityId.replace(/"/g, '\\"');
  const el = document.querySelector(
    `.sta-doc-tiptap .react-renderer.node-staEmbed[data-entity-id="${escaped}"]`
  ) as HTMLElement | null;
  if (!el) {
    return false;
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.add('sta-embed-restore-flash');
  window.setTimeout(() => {
    el.classList.remove('sta-embed-restore-flash');
  }, 1600);
  return true;
}
