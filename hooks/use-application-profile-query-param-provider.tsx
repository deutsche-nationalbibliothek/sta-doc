import { PropsWithChildren, createContext, useContext } from 'react';
import { useQueryParam } from 'use-query-params';

type ApplicationProfileParamContext = {
  view: string | undefined;
  setView: SetterFunc<string | undefined>;
};

type SetterFunc<T> = ReturnType<typeof useQueryParam<T>>[1];

// param is only used for typing context
const ApplicationProfileQueryParamContext = createContext(
  {} as ApplicationProfileParamContext
);

export default function ApplicationProfileQueryParamProvider({
  children,
}: PropsWithChildren) {
  const [view, setView] = useQueryParam<
    string | undefined,
    'application-profile'
  >('view');

  return (
    <ApplicationProfileQueryParamContext.Provider value={{ view, setView }}>
      {children}
    </ApplicationProfileQueryParamContext.Provider>
  );
}

export const useApplicationProfileQueryParam = () =>
  useContext(ApplicationProfileQueryParamContext);
