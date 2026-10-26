import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { App } from 'antd';
import useTranslation from 'next-translate/useTranslation';

type EditorUnsavedChangesContextValue = {
  setHasUnsavedChanges: (dirty: boolean) => void;
  confirmLeaveEditIfNeeded: (proceed: () => void) => void;
};

const EditorUnsavedChangesContext =
  createContext<EditorUnsavedChangesContextValue | null>(null);

const noopContext: EditorUnsavedChangesContextValue = {
  setHasUnsavedChanges: () => {},
  confirmLeaveEditIfNeeded: (proceed) => proceed(),
};

export const EditorUnsavedChangesProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const { modal } = App.useApp();
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';
  const dirtyRef = useRef(false);

  const setHasUnsavedChanges = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  const confirmLeaveEditIfNeeded = useCallback(
    (proceed: () => void) => {
      if (!dirtyRef.current) {
        proceed();
        return;
      }
      modal.confirm({
        title: isDe ? 'Ungespeicherte Änderungen' : 'Modifications non enregistrées',
        content: isDe
          ? 'Wenn Sie zur Ansicht wechseln, gehen alle nicht gespeicherten Änderungen verloren.'
          : 'Si vous passez à la vue, toutes les modifications non enregistrées seront perdues.',
        okText: isDe ? 'Zur Ansicht wechseln' : 'Passer à la vue',
        okType: 'danger',
        cancelText: isDe ? 'Weiter bearbeiten' : 'Continuer la modification',
        onOk: proceed,
      });
    },
    [isDe, modal]
  );

  const value = useMemo(
    () => ({ setHasUnsavedChanges, confirmLeaveEditIfNeeded }),
    [setHasUnsavedChanges, confirmLeaveEditIfNeeded]
  );

  return (
    <EditorUnsavedChangesContext.Provider value={value}>
      {children}
    </EditorUnsavedChangesContext.Provider>
  );
};

export function useEditorUnsavedChanges(): EditorUnsavedChangesContextValue {
  return useContext(EditorUnsavedChangesContext) ?? noopContext;
}
