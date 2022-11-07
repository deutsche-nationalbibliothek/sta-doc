import { Coding } from "@/types/entity";
import { useState } from "react";
import { useLocalStorage } from "react-use";

export const useCodingsPreference = () => {
  const codingsOptions = ['PICA+','PICA3']

  const [localStorageCodingPreferences, setCodingsPreferences] = useLocalStorage<string[]>('codings-preferences', codingsOptions);
  const [codingsPreferences, setCodingsPreferencesState] = useState<string[]>(localStorageCodingPreferences)

  const onChange = (newValue) => {
    setCodingsPreferences(newValue)
    setCodingsPreferencesState([...newValue])
  }
  return { codingsPreferences, onChange, codingsOptions }
}
