import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from 'react-use';

export type CodingsPreference = 'PICA+' | 'PICA3';

interface CodingsPreferencesContext {
  codingsPreferences: CodingsPreference[];
  onChange: (newValue: CodingsPreference[]) => void;
  codingsOptions: CodingsPreference[];
}

const CodingsPreferencesContext = createContext(
  {} as CodingsPreferencesContext
);

const useCodingsPreferenceLocal = () => {
  const codingsOptions: CodingsPreference[] = ['PICA+', 'PICA3'];

  const [localStorageCodingPreferences, setCodingsPreferences] =
    useLocalStorage<CodingsPreference[]>('codings-preferences', codingsOptions);

  const [codingsPreferences, setCodingsPreferencesState] = useState<
    CodingsPreference[]
  >(localStorageCodingPreferences as CodingsPreference[]);

  const onChange = (newValue: CodingsPreference[]) => {
    setCodingsPreferences(newValue);
    setCodingsPreferencesState([...newValue]);
  };
  return { codingsPreferences, onChange, codingsOptions };
};

export const CodingsPreferencesProvider = ({ children }) => {
  const codingsPreferences = useCodingsPreferenceLocal();
  return (
    <CodingsPreferencesContext.Provider value={codingsPreferences}>
      {children}
    </CodingsPreferencesContext.Provider>
  );
};

export const useCodingsPreference = () => useContext(CodingsPreferencesContext);