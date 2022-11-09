import { Coding } from '@/types/entity';
import { useState } from 'react';
import { useLocalStorage } from 'react-use';

export type CodingsPreference = 'PICA+' | 'PICA3';

export const useCodingsPreference = () => {
  const codingsOptions: CodingsPreference[] = ['PICA+', 'PICA3'];

  const [localStorageCodingPreferences, setCodingsPreferences] =
    useLocalStorage<CodingsPreference[]>('codings-preferences', codingsOptions);
  const [codingsPreferences, setCodingsPreferencesState] = useState<
    CodingsPreference[]
  >(localStorageCodingPreferences);

  const onChange = (newValue: CodingsPreference[]) => {
    setCodingsPreferences(newValue);
    setCodingsPreferencesState([...newValue]);
  };
  return { codingsPreferences, onChange, codingsOptions };
};
