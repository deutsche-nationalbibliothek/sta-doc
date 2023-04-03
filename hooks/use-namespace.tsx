import { Namespace } from '@/types/namespace';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';

interface NamespaceContext {
  namespace: Namespace | undefined;
  setNamespace: Dispatch<SetStateAction<Namespace | undefined>>;
  onResetNamespace: () => void;
}

const NamespaceContext = createContext({} as NamespaceContext);

interface NamespaceProviderProps {
  children: JSX.Element;
}

export const NamespaceProvider: React.FC<NamespaceProviderProps> = ({
  children,
}) => {
  const [namespace, setNamespace] = useState<Namespace>();

  const onResetNamespace = useCallback(() => {
    setNamespace(undefined);
  }, []);

  // useEffect(() => {
  //   router.events.on('routeChangeStart', onResetNamespace);
  //   return () => {
  //     router.events.off('routeChangeStart', onResetNamespace);
  //   };
  // }, []);

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
