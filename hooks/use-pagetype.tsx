import { Item } from '@/types/item';
import { useRouter } from 'next/router';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface PageTypeContext {
  pageType: { id?: Item };
  setPagetType: Dispatch<SetStateAction<{ id: Item }>>;
}

const PageTypeContext = createContext({} as PageTypeContext);

export const PageTypeProvider = ({ children }) => {
  const [pageType, setPagetType] = useState<{ id: Item }>();
  const router = useRouter();

  useEffect(() => {
    setPagetType(undefined);
  }, [router.asPath]);

  return (
    <PageTypeContext.Provider value={{ pageType, setPagetType }}>
      {children}
    </PageTypeContext.Provider>
  );
};

export const usePageType = () => useContext(PageTypeContext);
