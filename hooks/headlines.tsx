import { Headline, NestedHeadlines } from '@/types/headline';
import { nestedHeadlines } from '@/utils/nested-headlines';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface HeadlinesContext {
  // headlines in document, flat structure
  headlines: Headline[];
  setHeadlines: Dispatch<SetStateAction<Headline[]>>;

  // headlines in document, nested structure
  nestedHeadlines: NestedHeadlines[];

  // headlines path to actual headline in viewport
  currentHeadlinesPath: Omit<Headline, 'level'>[];
  setCurrentHeadlinesPath: Dispatch<SetStateAction<Omit<Headline, 'level'>[]>>;

  // headlines which are currently in viewport
  headlineKeysInViewport: string[];
  setHeadlineKeysInViewport: Dispatch<SetStateAction<string[]>>;
}

// param is only used for typing context
const HeadlineContext = createContext({} as HeadlinesContext);

export default function HeadlinesProvider({ children }) {
  const [headlines, setHeadlines] = useState<Headline[]>([]);

  const [currentHeadlinesPath, setCurrentHeadlinesPath] = useState<Headline[]>(
    []
  );

  const [headlineKeysInViewport, setHeadlineKeysInViewport] = useState<
    string[]
  >([]);

  return (
    <HeadlineContext.Provider
      value={{
        headlines,
        setHeadlines,
        nestedHeadlines: nestedHeadlines(headlines),
        currentHeadlinesPath,
        setCurrentHeadlinesPath,
        headlineKeysInViewport,
        setHeadlineKeysInViewport,
      }}
    >
      {children}
    </HeadlineContext.Provider>
  );
}

export const useHeadlines = () => useContext(HeadlineContext);
