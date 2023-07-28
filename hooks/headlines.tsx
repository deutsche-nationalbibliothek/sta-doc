import { Headline, NestedHeadlines } from '@/types/headline';
import { nestedHeadlines as nestedHeadlinesCalculation } from '@/utils/nested-headlines';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useInitialHeadlines } from './initial-headlines';
import { useApplicationProfileQueryParam } from './use-application-profile-query-param-provider';
import { useNamespace } from './use-namespace';

interface HeadlinesContext {
  // headlines in document, nested structure
  nestedHeadlines: NestedHeadlines[];

  // headlines path to actual headline in viewport
  currentHeadlinesPath: Omit<Headline, 'level'>[];
  setCurrentHeadlinesPath: Dispatch<SetStateAction<Omit<Headline, 'level'>[]>>;

  // headline keys which are currently in viewport
  headlineKeysInViewport: string[];
  setHeadlineKeysInViewport: Dispatch<SetStateAction<string[]>>;

  // controls if the headlines (TOC) get to render in ContentSplitter
  showHeadlines: boolean;
  setShowHeadlines: Dispatch<SetStateAction<boolean>>;
}

// param is only used for typing context
const HeadlineContext = createContext({} as HeadlinesContext);

export default function HeadlinesProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const { headlines } = useInitialHeadlines();

  useEffect(() => {
    if (!(headlines && headlines.length)) {
      setCurrentHeadlinesPath(
        (currentHeadlinesPath) => currentHeadlinesPath && []
      );
    }
  }, [headlines]);

  const [currentHeadlinesPath, setCurrentHeadlinesPath] = useState<Headline[]>(
    []
  );

  const [headlineKeysInViewport, setHeadlineKeysInViewport] = useState<
    string[]
  >([]);

  const { view } = useApplicationProfileQueryParam();
  const [showHeadlines, setShowHeadlines] = useState(!view);

  const { namespace } = useNamespace();

  const [nestedHeadlines, setNestedHeadlines] = useState<NestedHeadlines[]>([]);

  useEffect(() => {
    setNestedHeadlines(nestedHeadlinesCalculation(headlines ?? [], namespace));
  }, [headlines, namespace]);

  return (
    <HeadlineContext.Provider
      value={{
        nestedHeadlines,
        currentHeadlinesPath,
        setCurrentHeadlinesPath,
        headlineKeysInViewport,
        setHeadlineKeysInViewport,
        showHeadlines,
        setShowHeadlines,
      }}
    >
      {children}
    </HeadlineContext.Provider>
  );
}

export const useHeadlines = () => useContext(HeadlineContext);
