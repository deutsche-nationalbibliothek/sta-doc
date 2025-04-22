import {
  isPrimaryStaNamespace,
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
  const [namespace, setStaNamespace] = useState<Namespace>();

  const { setThemeConfig } = useThemeConfig();
  // @primary-color
  const nameSpaceTokens = useMemo<
    Record<NamespaceColor, { token: { colorPrimary?: string } }>
  >(
    () => ({
      [Namespace.STA]: {
        ...themeConfigDefault,
        token: {
          ...themeConfigDefault.token,
          colorPrimary: namespaceConfig.colors[Namespace.STA].primary,
        },
      },
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
  const onSetStaNamespace: Dispatch<Namespace | undefined> = (nextStaNamespace) => {
    if (nextStaNamespace) {
      if (isPrimaryStaNamespace(nextStaNamespace)) {
        setThemeConfig(nameSpaceTokens[nextStaNamespace]);
      } else {
        setThemeConfig(nameSpaceTokens['unspecific']);
      }
    }
    setStaNamespace(nextStaNamespace);
  };

  const onResetStaNamespace = useCallback(() => {
    setStaNamespace(undefined);
    setThemeConfig(nameSpaceTokens['unspecific']);
  }, [nameSpaceTokens, setThemeConfig]);

  return (
    <NamespaceContext.Provider
      value={{
        namespace,
        setNamespace: onSetStaNamespace,
        onResetNamespace: onResetStaNamespace,
      }}
    >
      {children}
    </NamespaceContext.Provider>
  );
};

export const useNamespace = () => useContext(NamespaceContext);
