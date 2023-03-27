import { useRouter } from '@/lib/next-use-router';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface IsLoadingContext {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const IsLoadingContext = createContext({} as IsLoadingContext);

export default function IsLoadingContextProvider({
  children,
}: PropsWithChildren) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setIsLoading(true);
    const handleComplete = (url: string) =>
      url === router.asPath && setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  return (
    <IsLoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </IsLoadingContext.Provider>
  );
}

export const useIsLoading = () => useContext(IsLoadingContext);
