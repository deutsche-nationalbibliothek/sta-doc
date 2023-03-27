import { Headline } from '@/types/headline';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface InitialHeadlinesContext {
  // headlines in document, flat structure
  headlines?: Headline[];
  setHeadlines: Dispatch<SetStateAction<Headline[]>>;
}

// param is only used for typing context
const InitialHeadlineContext = createContext({} as InitialHeadlinesContext);

export default function InitialHeadlinesProvider({
  children,
}: React.PropsWithChildren) {
  const [headlines, setHeadlines] = useState<Headline[]>([]);

  return (
    <InitialHeadlineContext.Provider
      value={{
        headlines,
        setHeadlines,
      }}
    >
      {children}
    </InitialHeadlineContext.Provider>
  );
}

export const useInitialHeadlines = () => useContext(InitialHeadlineContext);
