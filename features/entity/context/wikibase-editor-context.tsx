import { createContext, useContext, type ReactNode } from 'react';
import useWikibaseEditor, {
  type WikibaseEditor,
} from '@/hooks/use-wikibase-editor';

const WikibaseEditorContext = createContext<WikibaseEditor | null>(null);

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

export const useWikibaseEditorContext = () => {
  const context = useContext(WikibaseEditorContext);

  if (!context) {
    throw new Error(
      'useWikibaseEditorContext must be used within WikibaseEditorProvider'
    );
  }

  return context;
};
