import React, { createContext, useContext } from 'react';
import { useLocalStorage } from 'react-use';

export type CodingsPreference = 'PICA+' | 'PICA3' | 'Alma' | 'Aleph';

interface CodingsPreferencesContext {
  codingsPreferences: CodingsPreference[];
  onChange: (newValue: CodingsPreference[]) => void;
  codingsOptions: CodingsPreference[];
}

const CodingsPreferencesContext = createContext(
  {} as CodingsPreferencesContext
);

const useCodingsPreferenceLocal = () => {
  const codingsOptions: CodingsPreference[] = ['PICA+', 'PICA3', 'Alma', 'Aleph'];

  const [codingsPreferences, setCodingsPreferencesState] = useLocalStorage<
    CodingsPreference[]
  >('codings-preferences', codingsOptions);

  const onChange = (newValue: CodingsPreference[]) => {
    setCodingsPreferencesState([...newValue]);
  };
  return {
    codingsPreferences: codingsPreferences ?? [],
    onChange,
    codingsOptions,
  };
};

export const CodingsPreferencesProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const codingsPreferences = useCodingsPreferenceLocal();
  return (
    <CodingsPreferencesContext.Provider value={codingsPreferences}>
      {children}
    </CodingsPreferencesContext.Provider>
  );
};

export const useCodingsPreference = () => useContext(CodingsPreferencesContext);
