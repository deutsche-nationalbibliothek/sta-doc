import { theme } from 'antd';
import { ThemeConfig } from 'antd/lib/config-provider';
import colors from 'config/colors';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

const { darkAlgorithm, compactAlgorithm } = theme;
export const themeConfigDefault: ThemeConfig = {
  token: {
    colorPrimary: colors['unspecific-namespace-color'],
    // fontFamily: 'sans-serif',
    // fontFamily: 'EuclidCircularA, sans-serif',
    fontFamily: '"Montserrat", sans-serif;',
  },
  // algorithm: [compactAlgorithm],
  // algorithm: [darkAlgorithm, compactAlgorithm],
  // colorText: '#0068FF',
};

interface ThemeConfigContext {
  setThemeConfig: Dispatch<SetStateAction<ThemeConfig>>;
}

const ThemeConfigContext = createContext({} as ThemeConfigContext);

interface ThemeConfigProviderProps {
  children: (themeConfig: ThemeConfig) => JSX.Element;
}

export const ThemeConfigProvider: React.FC<ThemeConfigProviderProps> = ({
  children,
}) => {
  const [themeConfig, setThemeConfig] =
    useState<ThemeConfig>(themeConfigDefault);

  return (
    <ThemeConfigContext.Provider
      value={{
        setThemeConfig,
      }}
    >
      {children(themeConfig)}
    </ThemeConfigContext.Provider>
  );
};

export const useThemeConfig = () => useContext(ThemeConfigContext);
