import React, { createContext, useContext } from 'react';

export interface DocumentActions {
  /** Host page vs focused fragment panel. */
  mode: 'host' | 'fragment';
  onSave: () => void;
  onCancel: () => void;
  onValidate?: () => void;
  saving?: boolean;
  validating?: boolean;
  /** False while content matches last saved baseline. */
  cancelDisabled?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
}

const DocumentActionsContext = createContext<DocumentActions | null>(null);

export const DocumentActionsProvider: React.FC<
  React.PropsWithChildren<{ value: DocumentActions }>
> = ({ value, children }) => (
  <DocumentActionsContext.Provider value={value}>
    {children}
  </DocumentActionsContext.Provider>
);

export function useDocumentActions(): DocumentActions | null {
  return useContext(DocumentActionsContext);
}
