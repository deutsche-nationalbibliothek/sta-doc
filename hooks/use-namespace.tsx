import { isPrimaryNamepsace, Namespace } from '@/types/namespace';
import ConfigProvider from 'antd/lib/config-provider';
import namespaceConfig from 'config/namespace';
import {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useState,
} from 'react';

interface NamespaceContext {
  namespace: Namespace | undefined;
  setNamespace: Dispatch<Namespace | undefined>;
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
  // @primary-color
  const onSetNamepsace: Dispatch<Namespace | undefined> = (nextNamespace) => {
    if (nextNamespace) {
      if (isPrimaryNamepsace(nextNamespace)) {
        // // document.documentElement.style.setProperty(
        // //   '--namespace-color',
        // //   `rgb(${namespaceConfig.colors[nextNamespace]})`
        // // );
        // document.documentElement.style.setProperty(
        //   '--primary-1',
        //   `rgba(${namespaceConfig.colors[nextNamespace].primary}, 0.7)`
        // );
        // document.documentElement.style.setProperty(
        //   '--primary-2',
        //   `rgba(${namespaceConfig.colors[nextNamespace].primary}, 0.5)`
        // );
        // document.documentElement.style.setProperty(
        //   '--primary-3',
        //   `rgba(${namespaceConfig.colors[nextNamespace].primary}, 0.3)`
        // );
        // document.documentElement.style.setProperty(
        //   '--secondary',
        //   `rgb(${namespaceConfig.colors[nextNamespace].secondary})`
        // );
        console.log(`rgb(${namespaceConfig.colors[nextNamespace].primary})`);
        // ConfigProvider.config({
        //   theme: {
        //     primaryColor: `rgb(${namespaceConfig.colors[nextNamespace].primary})`,
        //   },
        // });
      } else {
        document.documentElement.style.setProperty(
          '--namespace-color',
          namespaceConfig.defaultColor
        );
      }
    }
    setNamespace(nextNamespace);
  };

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
        setNamespace: onSetNamepsace,
        onResetNamespace,
      }}
    >
      {children}
    </NamespaceContext.Provider>
  );
};

export const useNamespace = () => useContext(NamespaceContext);
