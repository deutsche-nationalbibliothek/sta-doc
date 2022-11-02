import { NestedHeadline } from '@/utils/nested-headlines';
import { createContext, useContext, useState } from 'react';

interface CurrentHeadlinesPathContext {
  currentHeadlinesPath: NestedHeadline[];
  setCurrentHeadlinesPath: (headlines: NestedHeadline[]) => void;
}

// param is only used for typing context
const CurrentHeadlinesPathContext = createContext(
  {} as CurrentHeadlinesPathContext
);

export default function CurrentHeadlinesPathProvider({ children }) {
  const [currentHeadlinesPath, setCurrentHeadlinesPath] = useState<
    NestedHeadline[]
  >([]);

  return (
    <CurrentHeadlinesPathContext.Provider
      value={{
        currentHeadlinesPath,
        setCurrentHeadlinesPath,
      }}
    >
      {children}
    </CurrentHeadlinesPathContext.Provider>
  );
}

export const useCurrentHeadlinesPath = () =>
  useContext(CurrentHeadlinesPathContext);
