import { useRouter } from '@/lib/next-use-router';
import { Namespace } from '@/types/namespace';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react';

interface NamespaceContext {
  namespace: Namespace;
  setNamespace: Dispatch<SetStateAction<Namespace>>;
  onResetNamespace: () => void;
}

const NamespaceContext = createContext({} as NamespaceContext);

export const NamespaceProvider = ({ children }) => {
  const [namespace, setNamespace] = useState<Namespace>();
  const router = useRouter();

  const onResetNamespace = () => {
    setNamespace(undefined);
  };

  useEffect(() => {
    router.events.on('routeChangeStart', onResetNamespace);
    return () => {
      router.events.off('routeChangeStart', onResetNamespace);
    };
  }, []);

  return (
    <NamespaceContext.Provider
      value={{
        namespace,
        setNamespace,
        onResetNamespace,
      }}
    >
      {children}
    </NamespaceContext.Provider>
  );
};

export const useNamespace = () => useContext(NamespaceContext);
