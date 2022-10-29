import { Headline } from '@/utils/entity-headlines';
import { createContext, useContext, useState } from 'react';

interface HeadlinesContext {
  headlines: Headline[];
  setHeadlines: (headlines: Headline[]) => void;
}

// param is only used for typing context
const HeadlineContext = createContext({} as HeadlinesContext);

export default function HeadlinesProvider({ children }) {
  const [headlines, setHeadlines] = useState<Headline[]>([]);

  return (
    <HeadlineContext.Provider value={{ headlines, setHeadlines }}>
      {children}
    </HeadlineContext.Provider>
  );
}

export const useHeadlines = () => useContext(HeadlineContext);
