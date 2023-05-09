import {
  isPrimaryNamepsace,
  Namespace,
  NamespaceColor,
} from '@/types/namespace';
import namespaceConfig from 'config/namespace';
import {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { themeConfigDefault, useThemeConfig } from './theme-provider';

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

  const { setThemeConfig } = useThemeConfig();
  // @primary-color
  const nameSpaceTokens = useMemo<
    Record<NamespaceColor, { token: { colorPrimary?: string } }>
  >(
    () => ({
      [Namespace.RDA]: {
        ...themeConfigDefault,
        token: {
          ...themeConfigDefault.token,
          colorPrimary: namespaceConfig.colors[Namespace.RDA].primary,
        },
      },
      [Namespace.GND]: {
        ...themeConfigDefault,
        token: {
          ...themeConfigDefault.token,
          colorPrimary: namespaceConfig.colors[Namespace.GND].primary,
        },
      },
      ['unspecific']: {
        ...themeConfigDefault,
        token: {
          ...themeConfigDefault.token,
          colorPrimary: namespaceConfig.colors['unspecific'].primary,
        },
      },
    }),
    []
  );
  const onSetNamepsace: Dispatch<Namespace | undefined> = (nextNamespace) => {
    if (nextNamespace) {
      if (isPrimaryNamepsace(nextNamespace)) {
        setThemeConfig(nameSpaceTokens[nextNamespace]);
      } else {
        setThemeConfig(nameSpaceTokens['unspecific']);
      }
    }
    setNamespace(nextNamespace);
  };

  const onResetNamespace = useCallback(() => {
    setNamespace(undefined);
    setThemeConfig(nameSpaceTokens['unspecific']);
  }, [nameSpaceTokens, setThemeConfig]);

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
