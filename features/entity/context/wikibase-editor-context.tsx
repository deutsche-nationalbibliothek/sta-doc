import { createContext, useContext, type ReactNode } from 'react';
import useWikibaseEditor, {
  type WikibaseEditor,
} from '@/hooks/use-wikibase-editor';

// Create a context to share the Wikibase editor state and functionality with all components nested inside the provider. The context is initialized with null to indicate that no provider is available.
const WikibaseEditorContext = createContext<WikibaseEditor | null>(null);

// Provides the Wikibase editor to all child components.
export const WikibaseEditorProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wikibaseEditor = useWikibaseEditor();

  return (
    <WikibaseEditorContext.Provider value={wikibaseEditor}>
      {children}
    </WikibaseEditorContext.Provider>
  );
};

// Custom hook to access the Wikibase editor context from any component nested inside WikibaseEditorProvider.
export const useWikibaseEditorContext = () => {
  const context = useContext(WikibaseEditorContext);

  // Ensure the hook is used within the provider.
  if (!context) {
    throw new Error(
      'useWikibaseEditorContext must be used within WikibaseEditorProvider'
    );
  }

  return context;
};
