import { Headline, NestedHeadlines } from '@/types/headline';
import { nestedHeadlines as nestedHeadlinesCalculation } from '@/utils/nested-headlines';
import { useRouter } from 'next/router';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDataSource } from './use-pagetype';

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
  const router = useRouter();

  useEffect(() => {
    const onResetHeadlines = () => setHeadlines([]);
    router.events.on('routeChangeStart', onResetHeadlines);
    return () => {
      router.events.off('routeChangeStart', onResetHeadlines);
    };
  }, []);

  const [currentHeadlinesPath, setCurrentHeadlinesPath] = useState<Headline[]>(
    []
  );

  const [headlineKeysInViewport, setHeadlineKeysInViewport] = useState<
    string[]
  >([]);

  const { dataSource } = useDataSource();

  const [nestedHeadlines, setNestedHeadlines] = useState<NestedHeadlines[]>([]);

  useEffect(() => {
    setNestedHeadlines(nestedHeadlinesCalculation(headlines, dataSource));
  }, [headlines, dataSource]);

  return (
    <HeadlineContext.Provider
      value={{
        headlines,
        setHeadlines,
        nestedHeadlines,
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
