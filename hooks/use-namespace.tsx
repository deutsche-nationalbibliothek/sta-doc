import {
  isPrimaryNamepsace,
  Namespace,
  NamespaceColor,
  namespaceFromAppPath,
} from '@/types/namespace';
import namespaceConfig from '@/config/namespace';
import {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';
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
  const applyNamespaceTheme = useCallback(
    (nextNamespace: Namespace | undefined) => {
      if (nextNamespace && isPrimaryNamepsace(nextNamespace)) {
        setThemeConfig(nameSpaceTokens[nextNamespace]);
      } else {
        setThemeConfig(nameSpaceTokens['unspecific']);
      }
    },
    [nameSpaceTokens, setThemeConfig]
  );

  const onSetNamepsace: Dispatch<Namespace | undefined> = (nextNamespace) => {
    applyNamespaceTheme(nextNamespace);
    setNamespace(nextNamespace);
  };

  const router = useRouter();
  useEffect(() => {
    const fromPath = namespaceFromAppPath(router.asPath);
    if (fromPath) {
      applyNamespaceTheme(fromPath);
      setNamespace(fromPath);
    }
  }, [router.asPath, applyNamespaceTheme]);

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
