import { useRouter } from '@/lib/next-use-router';
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
}

// param is only used for typing context
const HeadlineContext = createContext({} as HeadlinesContext);

export default function HeadlinesProvider({ children }) {
  const { headlines, setHeadlines } = useInitialHeadlines();
  const router = useRouter();

  useEffect(() => {
    const onResetHeadlines = () => {
      setHeadlines([]);
      setCurrentHeadlinesPath([]);
    };
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

  const { namespace } = useNamespace();

  const [nestedHeadlines, setNestedHeadlines] = useState<NestedHeadlines[]>([]);

  useEffect(() => {
    console.log(headlines,namespace)
    setNestedHeadlines(nestedHeadlinesCalculation(headlines, namespace));
  }, [headlines, namespace]);

  return (
    <HeadlineContext.Provider
      value={{
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
